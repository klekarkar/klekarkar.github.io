document.addEventListener("DOMContentLoaded", () => {
  const searchEl = document.getElementById("atlasSearch");
  const listEl = document.getElementById("atlasList");
  const countEl = document.getElementById("atlasCount");
  const clearEl = document.getElementById("atlasClear");

  // -------- Guards --------
  if (typeof L === "undefined") {
    console.error("Leaflet not loaded");
    if (countEl) {
      countEl.textContent = "Map failed to load (Leaflet missing).";
      countEl.style.color = "#b00020";
    }
    return;
  }

  if (!searchEl || !listEl || !countEl || !clearEl) {
    console.error("Atlas DOM elements missing");
    return;
  }

  // -------- Helpers --------
  const STORAGE_KEY = "atlas_base_layer";
  const TARGET_ZOOM = 8; // nice zoom for projects (adjust to taste)
  const FIT_PADDING = [30, 30];

  const escapeHtml = (str) =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const setCount = (shown, total) => {
    countEl.textContent = `${shown} of ${total} shown`;
    countEl.style.color = "";
  };

  const showError = (msg, err) => {
    console.error(msg, err);
    countEl.textContent = msg;
    countEl.style.color = "#b00020";
  };

  // -------- Map --------
  const map = L.map("atlasMap", { scrollWheelZoom: false }).setView([20, 0], 2);

  const baseLayers = {
    "Carto Light": L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { attribution: "&copy; OpenStreetMap contributors &copy; CARTO" }
    ),
    OpenStreetMap: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }),
    Satellite: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles &copy; Esri" }
    )
  };

  // Restore base layer choice
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialLayerName = saved && baseLayers[saved] ? saved : "Carto Light";
  baseLayers[initialLayerName].addTo(map);

  // Projects overlay (clusters)
  const cluster = L.markerClusterGroup({
    // keeps clusters a bit nicer
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false
  });
  cluster.addTo(map);

  // Layer control
  L.control
    .layers(baseLayers, { Projects: cluster }, { position: "topright", collapsed: true })
    .addTo(map);

  // Persist base layer changes
  map.on("baselayerchange", (e) => {
    localStorage.setItem(STORAGE_KEY, e.name);
  });

  // Nudge Leaflet sizing after layout settles
  const invalidate = () => map.invalidateSize();
  map.whenReady(invalidate);
  setTimeout(invalidate, 150);
  window.addEventListener("resize", invalidate);

  // -------- Data + State --------
  let items = [];
  const markerById = new Map(); // id -> marker
  let allBounds = null;
  let suppressAutoFit = false; // prevents filter from yanking view after user clicks a project
  let lastSelectedId = null;

  const fitToList = (list) => {
    if (suppressAutoFit) return;

    const pts = list.map((p) => [p.lat, p.lon]);
    if (pts.length) map.fitBounds(pts, { padding: FIT_PADDING });
    else if (allBounds) map.fitBounds(allBounds, { padding: FIT_PADDING });
  };

  const selectRow = (id) => {
    // Optional: highlight clicked row
    if (lastSelectedId != null) {
      const prev = listEl.querySelector(`[data-atlas-id="${lastSelectedId}"]`);
      if (prev) prev.classList.remove("is-active");
    }
    lastSelectedId = id;
    const el = listEl.querySelector(`[data-atlas-id="${id}"]`);
    if (el) el.classList.add("is-active");
  };

  const openProject = (p) => {
    const marker = markerById.get(p.id);
    if (!marker) return;

    suppressAutoFit = true;
    selectRow(p.id);

    cluster.zoomToShowLayer(marker, () => {
      const z = Math.max(map.getZoom(), TARGET_ZOOM);
      map.flyTo([p.lat, p.lon], z, { animate: true, duration: 0.8 });
      marker.openPopup();
    });

    // after a short time, allow fit again (so filtering later works normally)
    window.setTimeout(() => {
      suppressAutoFit = false;
    }, 1200);
  };

  const renderList = (list) => {
    listEl.innerHTML = "";

    if (!list.length) {
      const empty = document.createElement("div");
      empty.style.opacity = ".75";
      empty.style.padding = "10px 2px";
      empty.textContent = "No projects match your search.";
      listEl.appendChild(empty);
      return;
    }

    list.forEach((p) => {
      const row = document.createElement("div");
      row.className = "atlas-item";
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      row.dataset.atlasId = String(p.id);

      row.innerHTML =
        `<div class="atlas-thumb">${p.thumb ? `<img src="${p.thumb}" alt="">` : ""}</div>` +
        `<div class="atlas-text">` +
          `<div class="atlas-title" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</div>` +
          `<div class="atlas-sub" title="${escapeHtml(p.location)}">${escapeHtml(p.location)}</div>` +
          (p.tags && p.tags.length
            ? `<div class="atlas-tags">${p.tags
                .slice(0, 4)
                .map((t) => `<span class="atlas-tag">${escapeHtml(t)}</span>`)
                .join("")}</div>`
            : "") +
        `</div>`;

      const act = () => openProject(p);

      row.addEventListener("click", act);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          act();
        }
      });

      listEl.appendChild(row);
    });
  };

  const setMarkers = (list) => {
    cluster.clearLayers();
    list.forEach((p) => {
      const m = markerById.get(p.id);
      if (m) cluster.addLayer(m);
    });
  };

  const applyFilter = () => {
    const q = (searchEl.value || "").trim().toLowerCase();

    const filtered = !q
      ? items
      : items.filter((p) => {
          const hay = [p.title, p.location, p.excerpt, (p.tags || []).join(" ")]
            .join(" ")
            .toLowerCase();
          return hay.includes(q);
        });

    renderList(filtered);
    setMarkers(filtered);
    setCount(filtered.length, items.length);
    fitToList(filtered);
  };

  // If user opens a popup by clicking marker directly, highlight list row
  cluster.on("click", (e) => {
    // e.layer is the marker
    const marker = e.layer;
    if (!marker) return;

    // find id by reference
    for (const [id, m] of markerById.entries()) {
      if (m === marker) {
        selectRow(id);
        break;
      }
    }
  });

  // -------- Load Data --------
  (async () => {
    try {
      const dataUrl = window.__ATLAS_DATA_URL__ || "/assets/data/portfolio.json";
      const res = await fetch(dataUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`portfolio.json fetch failed: ${res.status}`);

      const raw = await res.json();
      if (!Array.isArray(raw)) throw new Error("portfolio.json is not an array");

      items = raw
        .map((p, idx) => ({
          id: idx,
          title: p.title || "Untitled",
          url: p.url || "#",
          thumb: p.thumb || "",
          location: p.location || "",
          excerpt: p.excerpt || "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          lat: Number(p.lat),
          lon: Number(p.lon)
        }))
        .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon));

      // Build markers once
      const pts = [];

      items.forEach((p) => {
        const popupHtml =
          `<div style="max-width:240px">` +
            `<div class="popup-title">${escapeHtml(p.title)}</div>` +
            (p.location ? `<div class="popup-sub">${escapeHtml(p.location)}</div>` : "") +
            (p.excerpt ? `<div style="margin-bottom:10px">${escapeHtml(p.excerpt)}</div>` : "") +
            `<a class="popup-link" href="${p.url}">Open project →</a>` +
          `</div>`;

        const marker = L.marker([p.lat, p.lon]).bindPopup(popupHtml);
        markerById.set(p.id, marker);
        cluster.addLayer(marker);
        pts.push([p.lat, p.lon]);
      });

      allBounds = pts.length ? L.latLngBounds(pts) : null;
      if (allBounds) map.fitBounds(allBounds, { padding: FIT_PADDING });

      renderList(items);
      setCount(items.length, items.length);

      // Wire UI
      searchEl.addEventListener("input", applyFilter);
      clearEl.addEventListener("click", () => {
        searchEl.value = "";
        searchEl.focus();
        applyFilter();
      });

    } catch (err) {
      showError("Failed to load projects (check console).", err);
    }
  })();
});

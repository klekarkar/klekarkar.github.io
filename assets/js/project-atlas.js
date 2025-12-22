document.addEventListener("DOMContentLoaded", async () => {
  const searchEl = document.getElementById("atlasSearch");
  const listEl = document.getElementById("atlasList");
  const countEl = document.getElementById("atlasCount");
  const clearEl = document.getElementById("atlasClear");

  // ---------- Map ----------
  if (typeof L === "undefined") {
    console.error("Leaflet not loaded");
    if (countEl) countEl.textContent = "Map failed to load (Leaflet missing).";
    return;
  }

  const map = L.map("atlasMap", { scrollWheelZoom: false }).setView([20, 0], 2);

  // Base layers
  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  });

  const cartoLight = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    { attribution: "&copy; OpenStreetMap contributors &copy; CARTO" }
  );

  const esriSat = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles &copy; Esri" }
  );

  // Default base layer
  cartoLight.addTo(map);

  // Overlay (projects)
  const cluster = L.markerClusterGroup();
  cluster.addTo(map);

  L.control
    .layers(
      {
        "Carto Light": cartoLight,
        "OpenStreetMap": osm,
        "Satellite": esriSat
      },
      { Projects: cluster },
      { position: "topright", collapsed: true }
    )
    .addTo(map);

  // Leaflet sometimes needs a resize nudge after layout/CSS changes
  map.whenReady(() => map.invalidateSize());
  setTimeout(() => map.invalidateSize(), 200);
  window.addEventListener("resize", () => map.invalidateSize());

  // ---------- Data + marker index ----------
  let items = [];
  const markerById = new Map(); // id -> marker
  const boundsAll = [];

  function updateCount(shown, total) {
    if (!countEl) return;
    countEl.textContent = `${shown} of ${total} shown`;
    countEl.style.color = "";
  }

  function showError(msg, err) {
    console.error(msg, err);
    if (!countEl) return;
    countEl.textContent = msg;
    countEl.style.color = "#b00020";
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function openProject(p) {
    const m = markerById.get(p.id);
    if (!m) return;

    const targetZoom = 4; // tweak as you like

    cluster.zoomToShowLayer(m, () => {
      map.flyTo(
        [p.lat, p.lon],
        Math.max(map.getZoom(), targetZoom),
        { animate: true, duration: 0.8 }
      );
      m.openPopup();
    });
  }

  function renderList(list) {
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

      row.innerHTML =
        `<div class="atlas-thumb">${p.thumb ? `<img src="${p.thumb}" alt="">` : ""}</div>` +
        `<div class="atlas-text">` +
          `<div class="atlas-title" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</div>` +
          `<div class="atlas-sub" title="${escapeHtml(p.location)}">${escapeHtml(p.location)}</div>` +
          (p.tags && p.tags.length
            ? `<div class="atlas-tags">${p.tags.slice(0, 4).map(t => `<span class="atlas-tag">${escapeHtml(t)}</span>`).join("")}</div>`
            : "") +
        `</div>`;

      row.addEventListener("click", () => openProject(p));
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProject(p);
        }
      });

      listEl.appendChild(row);
    });
  }

  function setMarkers(list) {
    cluster.clearLayers();
    const b = [];

    list.forEach((p) => {
      const m = markerById.get(p.id);
      if (m) cluster.addLayer(m);
      b.push([p.lat, p.lon]);
    });

    if (b.length) map.fitBounds(b, { padding: [30, 30] });
    else if (boundsAll.length) map.fitBounds(boundsAll, { padding: [30, 30] });
  }

  function applyFilter() {
    const q = (searchEl.value || "").trim().toLowerCase();

    const filtered = !q
      ? items
      : items.filter((p) => {
          const hay = [
            p.title,
            p.location,
            p.excerpt,
            (p.tags || []).join(" ")
          ].join(" ").toLowerCase();
          return hay.includes(q);
        });

    renderList(filtered);
    updateCount(filtered.length, items.length);
    setMarkers(filtered);
  }

  // ---------- Load portfolio.json ----------
  try {
    const dataUrl = window.__ATLAS_DATA_URL__ || "/assets/data/portfolio.json";
    const res = await fetch(dataUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`portfolio.json fetch failed: ${res.status}`);

    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("portfolio.json is not an array");

    // Normalize + keep only items with coordinates
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

    items.forEach((p) => {
      const popupHtml =
        `<div style="max-width:240px">` +
          `<div class="popup-title">${escapeHtml(p.title)}</div>` +
          (p.location ? `<div class="popup-sub">${escapeHtml(p.location)}</div>` : "") +
          (p.excerpt ? `<div style="margin-bottom:10px">${escapeHtml(p.excerpt)}</div>` : "") +
          `<a class="popup-link" href="${p.url}">Open project →</a>` +
        `</div>`;

      const m = L.marker([p.lat, p.lon]).bindPopup(popupHtml);
      markerById.set(p.id, m);
      cluster.addLayer(m);
      boundsAll.push([p.lat, p.lon]);
    });

    if (boundsAll.length) map.fitBounds(boundsAll, { padding: [30, 30] });

    renderList(items);
    updateCount(items.length, items.length);

    // Wire up search UI
    searchEl.addEventListener("input", applyFilter);
    clearEl.addEventListener("click", () => {
      searchEl.value = "";
      searchEl.focus();
      applyFilter();
    });

  } catch (err) {
    showError("Failed to load projects (check console).", err);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const searchEl = document.getElementById("atlasSearch");
  const listEl = document.getElementById("atlasList");
  const countEl = document.getElementById("atlasCount");
  const clearEl = document.getElementById("atlasClear");

  const map = L.map("atlasMap", { scrollWheelZoom: false }).setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const cluster = L.markerClusterGroup();
  cluster.addTo(map);

  let items = [];
  const markerById = new Map();
  const boundsAll = [];

  try {
    const dataUrl = (window.__ATLAS_DATA_URL__ || "/assets/data/portfolio.json");
    const res = await fetch(dataUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("portfolio.json fetch failed: " + res.status);

    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("portfolio.json is not an array");

    items = raw.map((p, idx) => ({
      id: idx,
      title: p.title || "Untitled",
      url: p.url || "#",
      thumb: p.thumb || "",
      location: p.location || "",
      excerpt: p.excerpt || "",
      tags: Array.isArray(p.tags) ? p.tags : [],
      lat: Number(p.lat),
      lon: Number(p.lon)
    })).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon));

    items.forEach(p => {
      const popupHtml =
        '<div style="max-width:240px">' +
          '<div class="popup-title">' + escapeHtml(p.title) + '</div>' +
          (p.location ? '<div class="popup-sub">' + escapeHtml(p.location) + '</div>' : '') +
          (p.excerpt ? '<div style="margin-bottom:10px">' + escapeHtml(p.excerpt) + '</div>' : '') +
          '<a class="popup-link" href="' + p.url + '">Open project →</a>' +
        '</div>';

      const m = L.marker([p.lat, p.lon]).bindPopup(popupHtml);
      cluster.addLayer(m);
      markerById.set(p.id, m);
      boundsAll.push([p.lat, p.lon]);
    });

    if (boundsAll.length) map.fitBounds(boundsAll, { padding: [30, 30] });

    renderList(items);
    updateCount(items.length, items.length);

  } catch (err) {
    console.error(err);
    countEl.textContent = "Failed to load projects (check console).";
    countEl.style.color = "#b00020";
  }

  function applyFilter() {
    const q = (searchEl.value || "").trim().toLowerCase();

    const filtered = !q ? items : items.filter(p => {
      const hay = (p.title + " " + p.location + " " + p.excerpt + " " + (p.tags || []).join(" ")).toLowerCase();
      return hay.includes(q);
    });

    renderList(filtered);
    updateCount(filtered.length, items.length);

    cluster.clearLayers();
    const b = [];
    filtered.forEach(p => {
      const m = markerById.get(p.id);
      if (m) cluster.addLayer(m);
      b.push([p.lat, p.lon]);
    });
    if (b.length) map.fitBounds(b, { padding: [30, 30] });
    else if (boundsAll.length) map.fitBounds(boundsAll, { padding: [30, 30] });
  }

  searchEl.addEventListener("input", applyFilter);
  clearEl.addEventListener("click", () => {
    searchEl.value = "";
    searchEl.focus();
    applyFilter();
  });

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

    list.forEach(p => {
      const row = document.createElement("div");
      row.className = "atlas-item";
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");

      row.innerHTML =
        '<div class="atlas-thumb">' +
          (p.thumb ? '<img src="' + p.thumb + '" alt="">' : '') +
        '</div>' +
        '<div class="atlas-text">' +
          '<div class="atlas-title" title="' + escapeHtml(p.title) + '">' + escapeHtml(p.title) + '</div>' +
          '<div class="atlas-sub" title="' + escapeHtml(p.location) + '">' + escapeHtml(p.location) + '</div>' +
          (p.tags && p.tags.length ? (
            '<div class="atlas-tags">' +
              p.tags.slice(0, 4).map(t => '<span class="atlas-tag">' + escapeHtml(t) + '</span>').join("") +
            '</div>'
          ) : "") +
        '</div>';

      const open = () => {
        const m = markerById.get(p.id);
        if (!m) return;
        map.setView([p.lat, p.lon], Math.max(map.getZoom(), 8), { animate: true });
        cluster.zoomToShowLayer(m, () => m.openPopup());
      };

      row.addEventListener("click", open);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });

      listEl.appendChild(row);
    });
  }

  function updateCount(shown, total) {
    countEl.textContent = shown + " of " + total + " shown";
    countEl.style.color = "";
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});

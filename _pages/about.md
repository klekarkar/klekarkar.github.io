---
permalink: /
title: "Hello there, I am Katoria"
author_profile: true
classes: wide
redirect_from:
  - /about/
  - /about.html
---

<div class="intro-card">
  <p>
    I am a PhD researcher in the Water and Climate Research Group at Vrije Universiteit Brussel. In my research, I quantify climate impacts on soil moisture and groundwater recharge, and evaluate how nature-based solutions can mitigate drought risk.
  </p>

  <p>
    I have 4 years of professional experience in the water sector, during which I have developed strategies for climate resilience, designed and supervised construction of water supply infrastructure, and supported investment planning for water projects.
  </p>
</div>

# Start Here

<div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:16px; margin: 1rem 0;">

  <a href="/portfolio/" style="text-decoration:none;">
    <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
      <video autoplay muted loop playsinline preload="metadata"
        style="width:100%; height:210px; object-fit:cover; display:block;">
        <source src="/images/water_zeb_credited.mp4" type="video/mp4">
      </video>
      <div style="padding:12px;">
        <div style="font-weight:600;">Industry Experience</div>
      </div>
    </div>
  </a>

  <a href="/cv/" style="text-decoration:none;">
    <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
      <img src="/images/education.png" alt="Education"
        style="width:100%; height:210px; object-fit:cover; display:block;">
      <div style="padding:12px;">
        <div style="font-weight:600;">Education</div>
      </div>
    </div>
  </a>

  <a href="https://scholar.google.com/citations?user=_rBmLxQAAAAJ&hl=en" style="text-decoration:none;">
    <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
      <img src="/images/research.png" alt="Research"
        style="width:100%; height:210px; object-fit:cover; display:block;">
      <div style="padding:12px;">
        <div style="font-weight:600;">Research</div>
      </div>
    </div>
  </a>

  <a href="/year-archive/" style="text-decoration:none;">
    <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
      <img src="/images/news.jpg" alt="Talks and conferences"
        style="width:100%; height:210px; object-fit:cover; display:block;">
      <div style="padding:12px;">
        <div style="font-weight:600;">Updates</div>
      </div>
    </div>
  </a>

</div>

<!-- ===== Home: Atlas Preview + Research Pipeline ===== -->

<!-- Leaflet (homepage mini-map only) -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<section class="home-showcase">
  <div class="home-showcase__grid">

    <!-- Research pipeline -->
    <div class="home-card">
      <div class="home-card__head">
        <h2 class="home-card__title">Research pipeline</h2>
        <div class="home-card__sub">From data to impact (hover / tap steps)</div>
      </div>

      <ol class="pipeline" aria-label="Research pipeline">
        <li class="pipeline__step">
          <div class="pipeline__dot"></div>
          <div class="pipeline__box">
            <div class="pipeline__label">Data</div>
            <div class="pipeline__detail">Satellite + in situ + reanalysis. Quality checks and harmonization.</div>
          </div>
        </li>

        <li class="pipeline__step">
          <div class="pipeline__dot"></div>
          <div class="pipeline__box">
            <div class="pipeline__label">Modeling</div>
            <div class="pipeline__detail">Hydrological / land-surface modeling + statistical learning.</div>
          </div>
        </li>

        <li class="pipeline__step">
          <div class="pipeline__dot"></div>
          <div class="pipeline__box">
            <div class="pipeline__label">Validation</div>
            <div class="pipeline__detail">Benchmarking and consistency checks across scales and products.</div>
          </div>
        </li>

        <li class="pipeline__step">
          <div class="pipeline__dot"></div>
          <div class="pipeline__box">
            <div class="pipeline__label">Insights</div>
            <div class="pipeline__detail">Drought characteristics, persistence, and land-surface memory.</div>
          </div>
        </li>

        <li class="pipeline__step">
          <div class="pipeline__dot"></div>
          <div class="pipeline__box">
            <div class="pipeline__label">Impact</div>
            <div class="pipeline__detail">Actionable outputs for monitoring, planning, and risk assessment.</div>
          </div>
        </li>
      </ol>

      <div class="home-card__cta">
        <a class="home-btn" href="/portfolio/">Project experience →</a>
        <a class="home-btn home-btn--ghost" href="https://scholar.google.com/citations?user=_rBmLxQAAAAJ&hl=en">Research →</a>
      </div>
    </div>

    <!-- Atlas preview -->
    <div class="home-card">
      <div class="home-card__head">
        <h2 class="home-card__title">Project Atlas preview</h2>
        <div class="home-card__sub">A quick glance at where projects happened</div>
      </div>

      <div class="home-atlas">
        <div id="homeAtlasMap" class="home-atlas__map" aria-label="Project Atlas preview map"></div>
      </div>

      <div class="home-card__cta">
        <a class="home-btn" href="/project-atlas/">Explore the Atlas →</a>
      </div>
    </div>

  </div>
</section>

<script>
  (async function () {
    try {
      if (typeof L === "undefined") return;

      const map = L.map("homeAtlasMap", {
        scrollWheelZoom: false,
        dragging: true,
        zoomControl: true
      }).setView([10, 10], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);

      const dataUrl = "{{ '/assets/data/portfolio.json' | relative_url }}";
      const res = await fetch(dataUrl, { cache: "no-store" });
      if (!res.ok) throw new Error("portfolio.json fetch failed: " + res.status);

      const raw = await res.json();
      if (!Array.isArray(raw)) throw new Error("portfolio.json not an array");

      const items = raw
        .map(p => ({
          title: p.title || "Untitled",
          url: p.url || "#",
          location: p.location || "",
          lat: Number(p.lat),
          lon: Number(p.lon)
        }))
        .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon))
        .slice(0, 12);

      const bounds = [];

      items.forEach(p => {
        const popup =
          '<div style="max-width:220px">' +
            '<div style="font-weight:700; margin-bottom:4px;">' + escapeHtml(p.title) + '</div>' +
            (p.location ? '<div style="opacity:.75; margin-bottom:8px;">' + escapeHtml(p.location) + '</div>' : '') +
            '<a href="' + p.url + '" style="text-decoration:none; font-weight:600;">Open →</a>' +
          '</div>';

        L.circleMarker([p.lat, p.lon], { radius: 6 }).addTo(map).bindPopup(popup);
        bounds.push([p.lat, p.lon]);
      });

      if (bounds.length) map.fitBounds(bounds, { padding: [18, 18] });

      setTimeout(() => map.invalidateSize(), 200);

      function escapeHtml(str) {
        return String(str)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }
    } catch (e) {
      console.error(e);
    }
  })();
</script>

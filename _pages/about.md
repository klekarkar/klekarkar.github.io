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
    I am a PhD researcher in the Water and Climate Research Group at Vrije Universiteit Brussel.
    In my research, I quantify climate impacts on soil moisture and groundwater recharge, and evaluate
    how nature-based solutions can mitigate drought risk.
  </p>
  <p>
    I have 4 years of professional experience in the water sector, developing climate resilience strategies,
    supervising water supply infrastructure, and supporting investment planning for water projects.
  </p>
</div>

## What I do

<div class="home-tiles">
  <!-- Industry tile: donut + counters -->
  <a id="tile-industry" class="home-tile" href="{{ '/portfolio/' | relative_url }}">
    <div class="home-tile-media tile-stats-simple">
      <div class="stat-chip">
        <div class="stat-num">20+</div>
        <div class="stat-label">Projects</div>
      </div>
      <div class="stat-chip">
        <div class="stat-num">$1M+</div>
        <div class="stat-label">Value</div>
      </div>
    </div>

    <div class="home-tile-body">
      <div class="home-tile-title">Project Portfolio</div>
    </div>
  </a>

  <!-- Education -->
  <a id="tile-education" class="home-tile" href="{{ '/cv/' | relative_url }}">
    <div class="home-tile-media">
      <img src="{{ '/images/education.png' | relative_url }}" alt="Education">
    </div>
    <div class="home-tile-body">
      <div class="home-tile-title">Education</div>
    </div>
  </a>

  <!-- Research -->
  <a id="tile-research" class="home-tile" href="https://scholar.google.com/citations?user=_rBmLxQAAAAJ&hl=en">
    <div class="home-tile-media">
      <img src="{{ '/images/research.png' | relative_url }}" alt="Research">
    </div>
    <div class="home-tile-body">
      <div class="home-tile-title">Research</div>
    </div>
  </a>

  <!-- Updates -->
  <a id="tile-updates" class="home-tile" href="{{ '/year-archive/' | relative_url }}">
    <div class="home-tile-media">
      <img src="{{ '/images/news.png' | relative_url }}" alt="Updates">
    </div>
    <div class="home-tile-body">
      <div class="home-tile-title">Updates</div>
    </div>
  </a>
</div>

<!-- Load homepage interactions -->
<script defer src="{{ '/assets/js/home-metrics.js' | relative_url }}"></script>

## Highlights

<div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:16px; margin: 1rem 0;">
  <div style="border:1px solid #cfd4deff; border-radius:14px; padding:14px; background:#fff;">
    <div style="font-weight:700; margin-bottom:6px;">Project Atlas</div>
    <div style="opacity:.85; line-height:1.6;">
      Explore my projects in an interactive map.
    </div>
    <div style="margin-top:10px;">
      <a href="{{ '/project-atlas/' | relative_url }}" style="text-decoration:none; font-weight:600;">
        Explore the Atlas →
      </a>
    </div>
  </div>
</div>

<script>
  document.addEventListener("mousemove", (e) => {
    const ids = ["tile-industry", "tile-education", "tile-research", "tile-updates"];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;

      if (!inside) return;

      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;

      el.style.setProperty("--mx", x + "%");
      el.style.setProperty("--my", y + "%");
    });
  });
</script>

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
    I have 4 years of professional experience in the water sector, developing climate resilience strategies, supervising water supply infrastructure, and supporting investment planning for water projects.
  </p>
</div>

## What I do
<div class="home-tiles">

  <a id="tile-industry" class="home-tile" href="{{ '/portfolio/' | relative_url }}">
    <div class="home-tile-media">
      <video autoplay muted loop playsinline preload="metadata">
        <source src="{{ '/images/water_river.mp4' | relative_url }}" type="video/mp4">
      </video>
    </div>

    <div class="home-tile-body">
      <div class="home-tile-title">Industry Experience</div>

      <div class="tile-metrics" aria-label="Industry metrics">
        <div class="metric">
          <div class="metric-top">
            <span class="metric-label">Projects completed</span>
            <span class="metric-value"><span class="countup" data-target="20">0</span>+</span>
          </div>
          <div class="metric-bar">
            <span class="metric-fill" style="--fill: 92%"></span>
          </div>
        </div>

        <div class="metric">
          <div class="metric-top">
            <span class="metric-label">Total value delivered</span>
            <span class="metric-value">$<span class="countup" data-target="1" data-decimals="0">0</span>M+</span>
          </div>
          <div class="metric-bar">
            <span class="metric-fill" style="--fill: 85%"></span>
          </div>
        </div>
      </div>
    </div>
  </a>

  <a id="tile-education" class="home-tile" href="{{ '/cv/' | relative_url }}">
    <div class="home-tile-media">
      <img src="{{ '/images/education.png' | relative_url }}" alt="Education">
    </div>
    <div class="home-tile-body">
      <div class="home-tile-title">Education</div>
    </div>
  </a>

  <a id="tile-research" class="home-tile" href="https://scholar.google.com/citations?user=_rBmLxQAAAAJ&hl=en">
    <div class="home-tile-media">
      <img src="{{ '/images/research.png' | relative_url }}" alt="Research">
    </div>
    <div class="home-tile-body">
      <div class="home-tile-title">Research</div>
    </div>
  </a>

  <a id="tile-updates" class="home-tile" href="{{ '/year-archive/' | relative_url }}">
    <div class="home-tile-media">
      <img src="{{ '/images/news.png' | relative_url }}" alt="Updates">
    </div>
    <div class="home-tile-body">
      <div class="home-tile-title">Updates</div>
    </div>
  </a>

</div>

<!-- ########################################### -->

<script>
document.addEventListener("DOMContentLoaded", () => {
  const tile = document.getElementById("tile-industry");
  if (!tile) return;

  const counters = tile.querySelectorAll(".countup");
  let ran = false;

  function animateCount(el, target, decimals = 0, duration = 900){
    const start = 0;
    const startTime = performance.now();

    function tick(now){
      const t = Math.min(1, (now - startTime) / duration);
      const value = start + (target - start) * t;
      el.textContent = Number(value).toFixed(decimals);

      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function run(){
    if (ran) return;
    ran = true;

    tile.classList.add("is-metrics-animated");

    counters.forEach(el => {
      const target = Number(el.dataset.target || 0);
      const decimals = Number(el.dataset.decimals || 0);
      animateCount(el, target, decimals);
    });
  }

  // Run when tile scrolls into view
  const io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) run();
  }, { threshold: 0.4 });

  io.observe(tile);
});
</script>

<!-- ##################################################################### -->


## Highlights

<div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:16px; margin: 1rem 0;">
  <div style="border:1px solid #cfd4deff; border-radius:14px; padding:14px; background:#fff;">
    <div style="font-weight:700; margin-bottom:6px;">Project Atlas</div>
    <div style="opacity:.85; line-height:1.6;">
      Explore my projects in an interactive map.
    </div>
    <div style="margin-top:10px;">
      <a href="/project-atlas/" style="text-decoration:none; font-weight:600;">Explore the Atlas →</a>
    </div>
  </div>
</div>

<script>
  document.addEventListener("mousemove", (e) => {
    const ids = ["tile-industry","tile-education","tile-research","tile-updates"];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", x + "%");
      el.style.setProperty("--my", y + "%");
    });
  });
</script>

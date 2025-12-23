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

## Start Here

<div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:16px; margin: 1rem 0;">

  <a id="tile-industry" href="/portfolio/" style="text-decoration:none;">
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

  <a id="tile-education" href="/cv/" style="text-decoration:none;">
    <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
      <img src="/images/education.png" alt="Education"
        style="width:100%; height:210px; object-fit:cover; display:block;">
      <div style="padding:12px;">
        <div style="font-weight:600;">Education</div>
      </div>
    </div>
  </a>

  <a id="tile-research" href="https://scholar.google.com/citations?user=_rBmLxQAAAAJ&hl=en" style="text-decoration:none;">
    <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
      <img src="/images/research.png" alt="Research"
        style="width:100%; height:210px; object-fit:cover; display:block;">
      <div style="padding:12px;">
        <div style="font-weight:600;">Research</div>
      </div>
    </div>
  </a>

  <a id="tile-updates" href="/year-archive/" style="text-decoration:none;">
    <div style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
      <img src="/images/news.jpg" alt="Updates"
        style="width:100%; height:210px; object-fit:cover; display:block;">
      <div style="padding:12px;">
        <div style="font-weight:600;">Updates</div>
      </div>
    </div>
  </a>

</div>

---

## Highlights

<div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:16px; margin: 1rem 0;">

  <div style="border:1px solid #e5e7eb; border-radius:14px; padding:14px; background:#fff;">
    <div style="font-weight:700; margin-bottom:6px;">Project Atlas</div>
    <div style="opacity:.85; line-height:1.6;">
      Explore my project locations with a searchable list + interactive map.
    </div>
    <div style="margin-top:10px;">
      <a href="/project-atlas/" style="text-decoration:none; font-weight:600;">Open the Atlas →</a>
    </div>
  </div>

</div>


<script>
  document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector(".intro-card");
    if (!card) return;

    const setPos = (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", x + "%");
      card.style.setProperty("--my", y + "%");
    };

    card.addEventListener("mousemove", setPos);
    card.addEventListener("mouseenter", setPos);

    // reset to a nice default when leaving
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "35%");
    });
  });
</script>

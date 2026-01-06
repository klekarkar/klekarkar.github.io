function animateIndustryTile(tile) {
  const rings = [...tile.querySelectorAll(".ring[data-pct]")].map((r) => ({
    el: r,
    pct: Number(r.getAttribute("data-pct")) || 0
  }));

  const counters = [...tile.querySelectorAll(".countup[data-target]")].map((c) => ({
    el: c,
    target: Number(c.getAttribute("data-target")) || 0,
    decimals: Number(c.getAttribute("data-decimals")) || 0,
    suffix: c.getAttribute("data-suffix") || ""
  }));

  // Reset to empty/zero
  rings.forEach((r) => r.el.style.setProperty("--pct", "0"));
  counters.forEach((c) => (c.el.textContent = "0"));

  const duration = 1100;
  const t0 = performance.now();

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function frame(now) {
    const p = Math.min(1, (now - t0) / duration);
    const e = easeOutCubic(p);

    // Fill rings in sync
    rings.forEach((r) => {
      const val = r.pct * e;
      r.el.style.setProperty("--pct", String(val));
    });

    // Count numbers in sync
    counters.forEach((c) => {
      const val = c.target * e;
      const txt = c.decimals > 0 ? val.toFixed(c.decimals) : String(Math.round(val));
      c.el.textContent = p < 1 ? txt : (c.decimals > 0 ? c.target.toFixed(c.decimals) : String(c.target)) + c.suffix;
    });

    if (p < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

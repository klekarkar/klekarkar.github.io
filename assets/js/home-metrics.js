document.addEventListener("DOMContentLoaded", () => {
  // Only run if tiles exist (prevents affecting other pages)
  const tiles = document.querySelectorAll(".home-tile");
  if (!tiles.length) return;

  // ---------- Count up ----------
  function animateCount(el, target, decimals, suffix) {
    const duration = 900;
    const t0 = performance.now();

    function tick(now) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = target * eased;

      el.textContent = decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));

      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (decimals > 0 ? target.toFixed(decimals) : String(target)) + (suffix || "");
    }

    requestAnimationFrame(tick);
  }

  function animateIndustryTile(tile) {
    // Animate rings
    tile.querySelectorAll(".ring[data-pct]").forEach((r) => {
      const pct = Number(r.getAttribute("data-pct")) || 0;
      r.style.setProperty("--pct", "0");
      requestAnimationFrame(() => r.style.setProperty("--pct", String(pct)));
    });

    // Animate numbers
    tile.querySelectorAll(".countup[data-target]").forEach((c) => {
      const target = Number(c.getAttribute("data-target")) || 0;
      const decimals = Number(c.getAttribute("data-decimals")) || 0;
      const suffix = c.getAttribute("data-suffix") || "";
      c.textContent = "0";
      animateCount(c, target, decimals, suffix);
    });
  }

  // Animate when visible
  const statMedias = document.querySelectorAll(".home-tile-media.tile-stats[data-animate='true']");
  if (statMedias.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const tile = e.target.closest(".home-tile");
          if (tile) animateIndustryTile(tile);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.4 }
    );

    statMedias.forEach((m) => io.observe(m));
  }

  // ---------- Spotlight tracking for hologram (uses --mx/--my) ----------
  document.addEventListener("mousemove", (e) => {
    tiles.forEach((tile) => {
      const r = tile.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;

      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      tile.style.setProperty("--mx", x + "%");
      tile.style.setProperty("--my", y + "%");
    });
  });
});

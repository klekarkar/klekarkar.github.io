(() => {
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function formatNumber(value, decimals) {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function animateCount(el, target, decimals, suffix, duration = 1100) {
    if (prefersReducedMotion()) {
      el.textContent = `${formatNumber(target, decimals)}${suffix}`;
      return;
    }

    const start = 0;
    const t0 = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now) {
      const p = Math.min(1, (now - t0) / duration);
      const e = easeOutCubic(p);
      const v = start + (target - start) * e;

      el.textContent = `${formatNumber(v, decimals)}${suffix}`;
      if (p < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function animateRing(ringEl, pct, duration = 1100) {
    if (prefersReducedMotion()) {
      ringEl.style.setProperty("--pct", String(pct));
      return;
    }

    const t0 = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now) {
      const p = Math.min(1, (now - t0) / duration);
      const e = easeOutCubic(p);
      const v = pct * e;

      ringEl.style.setProperty("--pct", v.toFixed(2));
      if (p < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function animateTile(tile) {
    if (tile.dataset.animated === "true") return;
    tile.dataset.animated = "true";

    // Ring
    const ring = tile.querySelector(".ring[data-pct]");
    if (ring) {
      const pct = Number(ring.getAttribute("data-pct")) || 0;
      ring.style.setProperty("--pct", "0");
      animateRing(ring, pct);
    }

    // Counters
    const counters = tile.querySelectorAll(".countup[data-target]");
    counters.forEach((el) => {
      const target = Number(el.getAttribute("data-target")) || 0;
      const decimals = Number(el.getAttribute("data-decimals")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";

      el.textContent = "0";
      animateCount(el, target, decimals, suffix);
    });
  }

  function init() {
    const tiles = document.querySelectorAll(".tile-stats[data-animate='true']");
    if (!tiles.length) return;

    // Animate when visible (Elfsight-like behavior)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateTile(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    tiles.forEach((t) => io.observe(t));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

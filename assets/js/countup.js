(() => {
  function formatNumber(value, decimals) {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function animateCount(el, target, decimals, prefix, suffix, duration = 1400) {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduceMotion) {
      el.textContent = prefix + formatNumber(target, decimals) + suffix;
      return;
    }

    const t0 = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
      const p = Math.min(1, (now - t0) / duration);
      const v = target * easeOutCubic(p);
      el.textContent = prefix + formatNumber(v, decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }

    // start at 0 (no flicker)
    el.textContent = prefix + formatNumber(0, decimals) + suffix;
    requestAnimationFrame(frame);
  }

  function runCountups(root = document) {
    const els = root.querySelectorAll(".countup[data-target]");
    if (!els.length) return;

    els.forEach((el) => {
      if (el.dataset.animated === "true") return;
      el.dataset.animated = "true";

      const target = Number(el.dataset.target || 0);
      const decimals = Number(el.dataset.decimals || 0);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";

      animateCount(el, target, decimals, prefix, suffix, 1400);
    });
  }

  function init() {
    // Animate only on homepage tile (so it doesn’t run elsewhere)
    const tile = document.getElementById("tile-industry");
    if (!tile) return;

    // Observe the media area (better threshold)
    const targetEl = tile.querySelector(".tile-stats-simple") || tile;

    if (!("IntersectionObserver" in window)) {
      runCountups(tile);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCountups(tile);
          io.disconnect();
        });
      },
      { threshold: 0.35 }
    );

    io.observe(targetEl);
  }

  // run on first paint of the page
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // If you navigate with back/forward cache
  window.addEventListener("pageshow", init);

  // If you ever use Turbo/Turbolinks
  document.addEventListener("turbo:load", init);
  document.addEventListener("turbolinks:load", init);
})();

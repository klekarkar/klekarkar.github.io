(() => {
  function formatNumber(value, decimals) {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function animateCount(el, target, decimals, prefix, suffix, duration = 900) {
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

    el.textContent = prefix + formatNumber(0, decimals) + suffix;
    requestAnimationFrame(frame);
  }

  function run() {
    const els = document.querySelectorAll(".countup[data-target]");
    if (!els.length) return;

    els.forEach((el) => {
      if (el.dataset.animated === "true") return;
      el.dataset.animated = "true";

      const target = Number(el.dataset.target || 0);
      const decimals = Number(el.dataset.decimals || 0);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";

      animateCount(el, target, decimals, prefix, suffix);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

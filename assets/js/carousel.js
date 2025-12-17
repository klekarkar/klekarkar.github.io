(function () {
  const carousels = document.querySelectorAll(".auto-carousel");
  carousels.forEach((carousel) => {
    const interval = parseInt(carousel.dataset.interval || "3500", 10);
    const imgs = Array.from(carousel.querySelectorAll("img"));
    if (imgs.length <= 1) return;

    let i = imgs.findIndex(img => img.classList.contains("active"));
    if (i < 0) { i = 0; imgs[0].classList.add("active"); }

    setInterval(() => {
      imgs[i].classList.remove("active");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("active");
    }, interval);
  });
})();

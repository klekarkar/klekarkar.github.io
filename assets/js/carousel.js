(function () {
  const carousels = document.querySelectorAll(".auto-carousel");

  carousels.forEach((carousel) => {
    const interval = parseInt(carousel.dataset.interval || "8000", 10);
    const track = carousel.querySelector(".slides");
    const slides = Array.from(track.querySelectorAll("img"));
    if (slides.length <= 1) return;

    let i = 0;

    setInterval(() => {
      i = (i + 1) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
    }, interval);
  });
})();


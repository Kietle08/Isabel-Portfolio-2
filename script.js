(function () {
  const logo = document.querySelector('.hero-logo');

  if (!logo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let ticking = false;

  function updateRotation() {
    const rotation = window.scrollY * 0.25;
    logo.style.transform = `rotate(${rotation}deg)`;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateRotation);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateRotation();
})();

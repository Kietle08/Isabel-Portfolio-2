(function () {
  const body = document.body;
  const heroCarousel = document.getElementById('heroCarousel');

  if (!body || !heroCarousel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let ticking = false;

  function syncLogoDockState() {
    const dockTrigger = Math.max(120, heroCarousel.offsetHeight * 0.16);
    body.classList.toggle('logo-in-nav', window.scrollY > dockTrigger);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(syncLogoDockState);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  syncLogoDockState();
})();

(function () {
  const audios = Array.from(document.querySelectorAll('.portfolio-audio'));
  const stickyPlayer = document.getElementById('stickyPlayer');
  const stickyTitle = document.getElementById('stickyPlayerTitle');
  const stickyToggle = document.getElementById('stickyPlayerToggle');

  if (!audios.length || !stickyPlayer || !stickyTitle || !stickyToggle) {
    return;
  }

  let activeAudio = null;

  function hideStickyPlayer() {
    stickyPlayer.classList.remove('is-visible');
    stickyPlayer.setAttribute('aria-hidden', 'true');
    stickyToggle.textContent = 'Stop';
    activeAudio = null;
  }

  function showStickyPlayer(audioEl) {
    const title = audioEl.dataset.title || 'Track';
    stickyTitle.textContent = title;
    stickyPlayer.classList.add('is-visible');
    stickyPlayer.setAttribute('aria-hidden', 'false');
    stickyToggle.textContent = 'Stop';
    activeAudio = audioEl;
  }

  function pauseOthers(currentAudio) {
    audios.forEach((audioEl) => {
      if (audioEl !== currentAudio && !audioEl.paused) {
        audioEl.pause();
      }
    });
  }

  function refreshStickyState() {
    const playingAudio = audios.find((audioEl) => !audioEl.paused && !audioEl.ended);
    if (!playingAudio) {
      hideStickyPlayer();
      return;
    }

    showStickyPlayer(playingAudio);
  }

  audios.forEach((audioEl) => {
    audioEl.addEventListener('play', () => {
      pauseOthers(audioEl);
      showStickyPlayer(audioEl);
    });

    audioEl.addEventListener('pause', refreshStickyState);
    audioEl.addEventListener('ended', refreshStickyState);
  });

  stickyToggle.addEventListener('click', () => {
    if (!activeAudio) {
      return;
    }

    activeAudio.pause();
    activeAudio.currentTime = 0;
  });
})();


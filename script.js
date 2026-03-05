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

(function () {
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  if (!contactForm || !contactStatus) {
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const recipient = contactForm.dataset.recipient || 'isabelcostallopes@gmail.com';

  function setStatus(message, isError) {
    contactStatus.textContent = message;
    contactStatus.classList.remove('text-success', 'text-danger');
    contactStatus.classList.add(isError ? 'text-danger' : 'text-success');
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const name = (document.getElementById('contactName')?.value || '').trim();
    const email = (document.getElementById('contactEmail')?.value || '').trim();
    const subjectInput = (document.getElementById('contactSubject')?.value || '').trim();
    const message = (document.getElementById('contactMessage')?.value || '').trim();

    const subject = subjectInput || 'Portfolio Inquiry';
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message,
    ].join('\n');

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (submitButton) {
      submitButton.disabled = true;
    }

    window.location.href = mailtoUrl;
    setStatus('Your email app should open with the message pre-filled.', false);

    window.setTimeout(() => {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }, 1200);
  });
})();


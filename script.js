(() => {
  const pages = [...document.querySelectorAll('.page')];
  const audio = document.getElementById('backgroundMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicLabel = musicToggle.querySelector('.music-label');
  let musicStarted = false;

  function showPage(name, updateHash = true) {
    const target = document.querySelector(`[data-page="${name}"]`);
    if (!target) return;
    pages.forEach(page => page.classList.toggle('active', page === target));
    if (updateHash) history.pushState({page:name}, '', `#${name}`);
    window.scrollTo({top:0, behavior:'instant'});
    if (name === 'letter' && document.getElementById('letterPaper').classList.contains('open')) {
      document.getElementById('letterPaper').scrollIntoView({behavior:'smooth', block:'start'});
    }
  }

  document.querySelectorAll('[data-go]').forEach(button => {
    button.addEventListener('click', () => showPage(button.dataset.go));
  });
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => showPage(card.dataset.go));
  });

  function updateMusicButton() {
    const playing = !audio.paused;
    musicToggle.classList.toggle('playing', playing);
    musicLabel.textContent = playing ? 'Music on' : 'Music';
    musicToggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  }
  async function startMusic() {
    try {
      await audio.play();
      musicStarted = true;
    } catch (e) {
      musicStarted = false;
    }
    updateMusicButton();
  }
  musicToggle.addEventListener('click', async () => {
    if (audio.paused) await startMusic();
    else { audio.pause(); updateMusicButton(); }
  });

  document.getElementById('openSurprise').addEventListener('click', async (event) => {
    event.currentTarget.classList.add('opening');
    await startMusic();
    setTimeout(() => showPage('celebration'), 550);
  });

  document.getElementById('openLetter').addEventListener('click', () => {
    const intro = document.getElementById('letterIntro');
    const envelope = document.getElementById('letterEnvelope');
    const paper = document.getElementById('letterPaper');
    const openButton = document.getElementById('openLetter');
    if (openButton.disabled) return;
    openButton.disabled = true;
    envelope.classList.add('unsealed');
    intro.classList.add('letter-opening');
    setTimeout(() => {
      intro.classList.add('letter-dismissed');
      setTimeout(() => {
        intro.style.display = 'none';
        paper.classList.add('open');
        paper.setAttribute('aria-hidden', 'false');
        document.querySelector('.letter-finish').classList.add('visible');
        paper.querySelectorAll('p, .letter-signoff').forEach((line, index) => {
          line.style.setProperty('--line-index', index);
          line.classList.add('letter-line-reveal');
        });
        setTimeout(() => paper.scrollIntoView({behavior:'smooth', block:'start'}), 180);
      }, 420);
    }, 950);
  });

  window.addEventListener('popstate', () => {
    const name = location.hash.replace('#','') || 'home';
    showPage(name, false);
  });
  const initial = location.hash.replace('#','');
  if (initial && document.querySelector(`[data-page="${initial}"]`)) showPage(initial, false);

  // Decorative sparkles and petals are intentionally lightweight.
  const sparkleLayer = document.getElementById('sparkles');
  const petalLayer = document.getElementById('petals');
  for (let i=0;i<34;i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = i % 3 === 0 ? '✧' : '·';
    s.style.left = `${Math.random()*100}%`;
    s.style.top = `${Math.random()*100}%`;
    s.style.setProperty('--dur', `${3+Math.random()*5}s`);
    s.style.setProperty('--delay', `${Math.random()*6}s`);
    s.style.setProperty('--size', `${8+Math.random()*13}px`);
    sparkleLayer.appendChild(s);
  }
  for (let i=0;i<13;i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = '✿';
    p.style.left = `${Math.random()*100}%`;
    p.style.setProperty('--dur', `${12+Math.random()*12}s`);
    p.style.setProperty('--delay', `${Math.random()*15}s`);
    p.style.setProperty('--size', `${9+Math.random()*12}px`);
    petalLayer.appendChild(p);
  }
})();

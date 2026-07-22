/* Névora protótipo — boot, estados (menu/jogo/pausa), loop e PWA */
(function () {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const el = {
    menu: document.getElementById('menu'),
    controls: document.getElementById('controlsScreen'),
    pause: document.getElementById('pauseScreen'),
    touch: document.getElementById('touch'),
    touchModeLabel: document.getElementById('touchModeLabel'),
  };

  let state = 'menu';          // menu | controls | game | pause
  let controlsReturn = 'menu'; // para onde o "voltar" dos controles leva
  let touchMode = localStorage.getItem('nv-touch') || 'auto'; // auto|on|off

  function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  }
  function isStandalonePWA() {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.matchMedia('(display-mode: fullscreen)').matches
      || window.navigator.standalone === true;
  }
  function touchUIWanted() {
    if (touchMode === 'on') return true;
    if (touchMode === 'off') return false;
    return isTouchDevice() || (isStandalonePWA() && !NV.Input.keyboardSeen);
  }

  function show(which) {
    el.menu.classList.toggle('hidden', which !== 'menu');
    el.controls.classList.toggle('hidden', which !== 'controls');
    el.pause.classList.toggle('hidden', which !== 'pause');
    el.touch.classList.toggle('hidden', !(which === 'game' && touchUIWanted()));
    state = which;
    NV.Input.clear();
  }

  function updateTouchLabel() {
    el.touchModeLabel.textContent = { auto: 'Auto', on: 'Sempre', off: 'Nunca' }[touchMode];
  }

  // ---------- botões ----------
  document.getElementById('btnPlay').addEventListener('click', () => {
    // desktop com teclado: mostra o mapeamento antes da primeira partida
    if (!touchUIWanted() && !localStorage.getItem('nv-seen-controls')) {
      controlsReturn = 'startgame';
      show('controls');
    } else startGame();
  });
  document.getElementById('btnControls').addEventListener('click', () => {
    controlsReturn = 'menu'; show('controls');
  });
  document.getElementById('btnTouchMode').addEventListener('click', () => {
    touchMode = { auto: 'on', on: 'off', off: 'auto' }[touchMode];
    localStorage.setItem('nv-touch', touchMode);
    updateTouchLabel();
  });
  document.getElementById('btnStartFromControls').addEventListener('click', () => {
    localStorage.setItem('nv-seen-controls', '1');
    if (controlsReturn === 'startgame') startGame();
    else if (controlsReturn === 'pause') show('pause');
    else show('menu');
  });
  document.getElementById('btnBackFromControls').addEventListener('click', () => {
    localStorage.setItem('nv-seen-controls', '1');
    show(controlsReturn === 'pause' ? 'pause' : 'menu');
  });
  document.getElementById('btnResume').addEventListener('click', () => show('game'));
  document.getElementById('btnPauseControls').addEventListener('click', () => {
    controlsReturn = 'pause'; show('controls');
  });
  document.getElementById('btnQuit').addEventListener('click', () => show('menu'));

  function startGame() {
    NV.Game.start();
    show('game');
  }

  NV.Input.bindTouchButtons(el.touch);

  // ---------- loop ----------
  let last = performance.now() / 1000, acc = 0, elapsed = 0;
  const STEP = 1 / 60;

  function loop() {
    const now = performance.now() / 1000;
    let dt = now - last; last = now;
    if (dt > 0.25) dt = 0.25; // aba voltou do fundo
    elapsed += dt;

    if (state === 'game') {
      if (NV.Input.justPressed('pause')) { show('pause'); }
      else {
        acc += dt;
        while (acc >= STEP) { NV.Game.update(STEP, elapsed); acc -= STEP; }
        NV.Render.frame(ctx, NV.Game.state, elapsed, dt);
      }
    } else if (state === 'pause') {
      if (NV.Input.justPressed('pause')) show('game');
      NV.Render.frame(ctx, NV.Game.state, elapsed, 0);
    } else {
      // fundo animado simples do menu
      drawMenuBackdrop(elapsed);
    }
    NV.Input.endFrame();
    requestAnimationFrame(loop);
  }

  function drawMenuBackdrop(t) {
    const grad = ctx.createLinearGradient(0, 0, 0, 540);
    grad.addColorStop(0, '#241627'); grad.addColorStop(1, '#54301e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 960, 540);
    // velas distantes tremulando
    for (let i = 0; i < 9; i++) {
      const x = 60 + i * 105, h = 90 + (i * 53 % 130);
      ctx.fillStyle = 'rgba(20,12,18,0.8)';
      ctx.fillRect(x, 540 - h, 34, h);
      const f = 3 + Math.sin(t * 6 + i * 2) * 1.5;
      const gr = ctx.createRadialGradient(x + 17, 540 - h - 8, 1, x + 17, 540 - h - 8, 26);
      gr.addColorStop(0, 'rgba(255,220,150,0.8)'); gr.addColorStop(1, 'rgba(255,177,59,0)');
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(x + 17, 540 - h - 8, 18 + f, 0, 7); ctx.fill();
    }
  }

  // pausa automática quando a aba perde o foco
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'game') show('pause');
  });

  // ---------- PWA ----------
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  updateTouchLabel();
  show('menu');
  requestAnimationFrame(loop);
})();

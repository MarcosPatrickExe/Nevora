/* Névora protótipo — boot, estados (menu/jogo/pausa), loop e PWA */
(function () {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const el = {
    menu: document.getElementById('menu'),
    controls: document.getElementById('controlsScreen'),
    pause: document.getElementById('pauseScreen'),
    nickname: document.getElementById('nicknameScreen'),
    summary: document.getElementById('summaryScreen'),
    touch: document.getElementById('touch'),
    touchModeLabel: document.getElementById('touchModeLabel'),
    shop: document.getElementById('shopScreen'),
    nicknameInput: document.getElementById('nicknameInput'),
    summaryText: document.getElementById('summaryText'),
    shopSevia: document.getElementById('shopSevia'),
    priceHeart: document.getElementById('priceHeart'),
    priceFulgor: document.getElementById('priceFulgor'),
    tbtnInteract: document.getElementById('tbtnInteract'),
  };

  let state = 'menu';          // menu | controls | game | pause | nickname | summary
  let controlsReturn = 'menu'; // para onde o "voltar" dos controles leva
  let summaryReturn = 'menu';  // para onde o "voltar" do resumo leva
  let touchMode = localStorage.getItem('nv-touch') || 'auto'; // auto|on|off
  let audioUnlocked = false;
  function unlockAudioOnce() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    NV.Audio.unlock();
  }

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
    el.nickname.classList.toggle('hidden', which !== 'nickname');
    el.summary.classList.toggle('hidden', which !== 'summary');
    el.touch.classList.toggle('hidden', !(which === 'game' && touchUIWanted()));
    if (which !== 'game') { el.shop.classList.add('hidden'); el.tbtnInteract.classList.add('hidden'); }
    state = which;
    NV.Input.clear();
    if (which === 'nickname') el.nicknameInput.focus();
  }

  function openSummary(from) {
    summaryReturn = from;
    el.summaryText.textContent = NV.Save.summaryText();
    show('summary');
  }

  function updateTouchLabel() {
    el.touchModeLabel.textContent = { auto: 'Auto', on: 'Sempre', off: 'Nunca' }[touchMode];
  }

  // ---------- botões ----------
  function proceedToPlay() {
    // desktop com teclado: mostra o mapeamento antes da primeira partida
    if (!touchUIWanted() && !localStorage.getItem('nv-seen-controls')) {
      controlsReturn = 'startgame';
      show('controls');
    } else startGame();
  }
  document.getElementById('btnPlay').addEventListener('click', () => {
    unlockAudioOnce();
    if (!NV.Save.state.nickname) show('nickname');
    else proceedToPlay();
  });
  document.getElementById('btnNicknameConfirm').addEventListener('click', () => {
    unlockAudioOnce();
    NV.Save.setNickname(el.nicknameInput.value);
    proceedToPlay();
  });
  el.nicknameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btnNicknameConfirm').click();
  });
  document.getElementById('btnControls').addEventListener('click', () => {
    controlsReturn = 'menu'; show('controls');
  });
  document.getElementById('btnSummary').addEventListener('click', () => openSummary('menu'));
  document.getElementById('btnPauseSummary').addEventListener('click', () => openSummary('pause'));
  document.getElementById('btnBackFromSummary').addEventListener('click', () => show(summaryReturn));
  document.getElementById('btnCopySummary').addEventListener('click', () => {
    const text = NV.Save.summaryText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  });
  document.getElementById('btnTouchMode').addEventListener('click', () => {
    touchMode = { auto: 'on', on: 'off', off: 'auto' }[touchMode];
    localStorage.setItem('nv-touch', touchMode);
    updateTouchLabel();
  });
  document.getElementById('btnStartFromControls').addEventListener('click', () => {
    unlockAudioOnce();
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

  // ---------- loja (Tio Sebo) ----------
  function updateShopUI() {
    const p = NV.Game.state.player;
    el.shopSevia.textContent = p.sevia;
    el.priceHeart.textContent = p.shopPrice('heart');
    el.priceFulgor.textContent = p.shopPrice('fulgorFlask');
  }
  document.getElementById('btnBuyHeart').addEventListener('click', () => {
    NV.Game.state.player.buyItem(NV.Game.state, 'heart');
    updateShopUI();
  });
  document.getElementById('btnBuyFulgor').addEventListener('click', () => {
    NV.Game.state.player.buyItem(NV.Game.state, 'fulgorFlask');
    updateShopUI();
  });
  document.getElementById('btnCloseShop').addEventListener('click', () => {
    NV.Game.state.shopOpen = false;
    NV.Game.state.interactCd = 0.3;
  });

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
      if (NV.Input.justPressed('pause') && !NV.Game.state.shopOpen) { show('pause'); }
      else {
        acc += dt;
        while (acc >= STEP) { NV.Game.update(STEP, elapsed); acc -= STEP; }
        NV.Render.frame(ctx, NV.Game.state, elapsed, dt);
        el.shop.classList.toggle('hidden', !NV.Game.state.shopOpen);
        if (NV.Game.state.shopOpen) updateShopUI();
        el.tbtnInteract.classList.toggle('hidden',
          !(touchUIWanted() && NV.Game.state.nearNpc && !NV.Game.state.shopOpen));
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

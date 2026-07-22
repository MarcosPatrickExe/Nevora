/* Névora protótipo — entrada unificada (teclado + touch) */
window.NV = window.NV || {};

NV.Input = (function () {
  const down = {};   // action -> bool (estado atual)
  const prev = {};   // estado do frame anterior

  const KEYMAP = {
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    Space: 'jump',
    KeyJ: 'attack', KeyX: 'attack',
    KeyK: 'dash', KeyC: 'dash',
    KeyL: 'heal', KeyV: 'heal',
    Escape: 'pause', Enter: 'confirm',
  };
  // W/↑ também pulam (além de mirar para cima)
  const ALSO_JUMP = { ArrowUp: true, KeyW: true };

  let keyboardSeen = false;

  window.addEventListener('keydown', (e) => {
    const a = KEYMAP[e.code];
    if (!a) return;
    keyboardSeen = true;
    if (!e.repeat) {
      down[a] = true;
      if (ALSO_JUMP[e.code]) down.jump = true;
    }
    if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    const a = KEYMAP[e.code];
    if (!a) return;
    down[a] = false;
    if (ALSO_JUMP[e.code]) {
      // só solta o pulo se nenhuma outra tecla de pulo estiver pressionada
      down.jump = !!down._spaceHeld;
    }
    if (e.code === 'Space') down.jump = false;
  });
  window.addEventListener('keydown', (e) => { if (e.code === 'Space') down._spaceHeld = true; });
  window.addEventListener('keyup', (e) => { if (e.code === 'Space') down._spaceHeld = false; });

  function bindTouchButtons(root) {
    root.querySelectorAll('.tbtn').forEach((btn) => {
      const a = btn.dataset.action;
      const on = (e) => { e.preventDefault(); down[a] = true; };
      const off = (e) => { e.preventDefault(); down[a] = false; };
      btn.addEventListener('pointerdown', on);
      btn.addEventListener('pointerup', off);
      btn.addEventListener('pointercancel', off);
      btn.addEventListener('pointerleave', off);
    });
  }

  return {
    pressed: (a) => !!down[a],
    justPressed: (a) => !!down[a] && !prev[a],
    endFrame: () => { for (const k in down) prev[k] = down[k]; },
    clear: () => { for (const k in down) down[k] = false; },
    bindTouchButtons,
    get keyboardSeen() { return keyboardSeen; },
  };
})();

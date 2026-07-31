/* Névora protótipo — entrada unificada (teclado + touch)
   Cada tecla física mapeia para 1+ ações; o estado de uma ação é o OU de
   todas as teclas que a controlam. Isso evita que soltar uma tecla "roube"
   o estado de outra que controla a mesma ação (ex.: pulo em W e Espaço). */
window.NV = window.NV || {};

NV.Input = (function () {
  const keyDown = {};   // código físico de tecla -> bool
  const touchDown = {}; // ação -> bool (botões de toque)
  const down = {};      // ação -> bool (mesclado, estado atual)
  const prev = {};      // ação -> bool (estado do frame anterior)

  // Movimento e mira: WASD/setas. Pulo aceita Espaço OU W/↑ (mirar pra cima
  // também pula, de propósito). Habilidades: padrão no teclado numérico
  // (extremo direito, longe do movimento) + alternativa em letras/E-F para
  // quem não tem numpad (notebook).
  const KEYMAP = {
    ArrowLeft: ['left'], KeyA: ['left'],
    ArrowRight: ['right'], KeyD: ['right'],
    ArrowUp: ['up', 'jump'], KeyW: ['up', 'jump'],
    ArrowDown: ['down'], KeyS: ['down'],
    Space: ['jump'],
    KeyJ: ['attack'], KeyX: ['attack'], Numpad5: ['attack'],
    KeyK: ['dash'], KeyC: ['dash'], Numpad6: ['dash'],
    KeyL: ['heal'], KeyV: ['heal'], Numpad8: ['heal'],
    KeyE: ['interact'], KeyF: ['interact'], Numpad2: ['interact'],
    Escape: ['pause'], Enter: ['confirm'], KeyM: ['map'],
  };

  function isDownAnywhere(action) {
    if (touchDown[action]) return true;
    for (const code in KEYMAP) {
      if (keyDown[code] && KEYMAP[code].includes(action)) return true;
    }
    return false;
  }
  function recompute(actions) {
    for (const action of actions) down[action] = isDownAnywhere(action);
  }

  let keyboardSeen = false;

  window.addEventListener('keydown', (e) => {
    const actions = KEYMAP[e.code];
    if (!actions) return;
    keyboardSeen = true;
    if (!e.repeat) { keyDown[e.code] = true; recompute(actions); }
    if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    const actions = KEYMAP[e.code];
    if (!actions) return;
    keyDown[e.code] = false;
    recompute(actions);
  });

  let editingTouch = false; // true durante o editor de layout dos botões touch

  function bindTouchButtons(root) {
    root.querySelectorAll('.tbtn').forEach((btn) => {
      const a = btn.dataset.action;
      const on = (e) => { if (editingTouch) return; e.preventDefault(); touchDown[a] = true; recompute([a]); };
      const off = (e) => { if (editingTouch) return; e.preventDefault(); touchDown[a] = false; recompute([a]); };
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
    clear: () => {
      for (const k in keyDown) keyDown[k] = false;
      for (const k in touchDown) touchDown[k] = false;
      for (const k in down) down[k] = false;
    },
    bindTouchButtons,
    setEditingTouch(v) {
      editingTouch = v;
      if (v) { for (const k in touchDown) touchDown[k] = false; recompute(Object.keys(touchDown)); }
    },
    get keyboardSeen() { return keyboardSeen; },
  };
})();

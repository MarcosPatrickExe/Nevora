/* Névora protótipo — editor de layout dos botões touch (arrastar/redimensionar)
   Posições e tamanhos ficam em localStorage; sobrevive a fechar o navegador. */
window.NV = window.NV || {};

NV.TouchLayout = (function () {
  const KEY = 'nv-touch-layout';
  let layout = {};
  let editing = false;
  let root = null;
  let drag = null;   // { btn, action, startX, startY, origDx, origDy }
  let resize = null; // { action, startY, origScale }

  function load() {
    try { layout = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { layout = {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(layout)); } catch (e) {}
  }
  function entry(a) {
    if (!layout[a]) layout[a] = { dx: 0, dy: 0, scale: 1 };
    return layout[a];
  }

  function apply() {
    if (!root) return;
    root.querySelectorAll('.tbtn').forEach((btn) => {
      const a = btn.dataset.action;
      const L = layout[a];
      // #tbtnInteract já usa transform:translateX(-50%) no CSS para se centralizar;
      // preservamos essa base e só somamos o ajuste do jogador por cima.
      const base = (btn.id === 'tbtnInteract') ? 'translateX(-50%) ' : '';
      btn.style.transform = L ? `${base}translate(${L.dx}px, ${L.dy}px) scale(${L.scale})` : (base || '');
    });
  }

  function reset() { layout = {}; save(); apply(); }

  function onPointerDown(e) {
    if (!editing) return;
    if (e.target.classList.contains('tbtn-resize')) return; // tratado pelo handle
    const btn = e.currentTarget;
    const a = btn.dataset.action;
    const L = entry(a);
    e.preventDefault(); e.stopPropagation();
    drag = { btn, a, startX: e.clientX, startY: e.clientY, origDx: L.dx, origDy: L.dy };
    try { btn.setPointerCapture(e.pointerId); } catch (err) {}
  }
  function onResizeDown(e) {
    if (!editing) return;
    e.preventDefault(); e.stopPropagation();
    const btn = e.currentTarget.closest('.tbtn');
    const a = btn.dataset.action;
    const L = entry(a);
    resize = { a, startY: e.clientY, origScale: L.scale };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  }
  function onPointerMove(e) {
    if (drag) {
      const L = entry(drag.a);
      L.dx = drag.origDx + (e.clientX - drag.startX);
      L.dy = drag.origDy + (e.clientY - drag.startY);
      apply();
    }
    if (resize) {
      const L = entry(resize.a);
      const delta = (resize.startY - e.clientY) / 90; // arrastar pra cima = maior
      L.scale = Math.max(0.6, Math.min(1.9, resize.origScale + delta));
      apply();
    }
  }
  function onPointerUp() {
    if (drag) { save(); drag = null; }
    if (resize) { save(); resize = null; }
  }

  function attachHandles() {
    root.querySelectorAll('.tbtn').forEach((btn) => {
      btn.classList.add('tbtn-editable');
      btn.addEventListener('pointerdown', onPointerDown);
      let handle = btn.querySelector('.tbtn-resize');
      if (!handle) {
        handle = document.createElement('span');
        handle.className = 'tbtn-resize';
        btn.appendChild(handle);
      }
      handle.addEventListener('pointerdown', onResizeDown);
    });
  }
  function detachHandles() {
    root.querySelectorAll('.tbtn').forEach((btn) => {
      btn.classList.remove('tbtn-editable');
      btn.removeEventListener('pointerdown', onPointerDown);
      const handle = btn.querySelector('.tbtn-resize');
      if (handle) handle.removeEventListener('pointerdown', onResizeDown);
    });
  }

  function init(touchRoot) {
    root = touchRoot;
    load();
    apply();
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }
  function enterEdit() {
    editing = true;
    NV.Input.setEditingTouch(true);
    attachHandles();
  }
  function exitEdit() {
    editing = false;
    NV.Input.setEditingTouch(false);
    detachHandles();
  }

  return { init, enterEdit, exitEdit, reset, get editing() { return editing; } };
})();

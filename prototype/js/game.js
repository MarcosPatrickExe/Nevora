/* Névora protótipo — orquestração: nível atual, câmera, transições, morte */
window.NV = window.NV || {};

NV.Game = (function () {
  const T = NV.World.TILE;
  const VW = 960, VH = 540;

  const g = {
    level: null, player: null,
    enemies: [], projectiles: [], particles: [],
    camX: 0, camY: 0, shake: 0, hitstop: 0, fade: 1,
    toast: '', toastSub: '', toastT: 0,
    lampLit: false, lampCd: 0,
    respawn: { level: 0, useLamp: false }, // ponto de retorno
    finished: false,
    onPlayerDeath: null,
  };

  function loadLevel(idx, enter) {
    const lv = NV.World.buildLevel(idx);
    g.level = lv;
    g.enemies = lv.enemies.map((s) => NV.Entities.makeEnemy(s));
    g.projectiles = []; g.particles = [];
    g.lampLit = (g.respawn.level === idx && g.respawn.useLamp);
    g.lampCd = 0;

    let pos;
    if (enter === 'left') pos = lv.entryLeft;
    else if (enter === 'right') pos = lv.entryRight;
    else if (enter === 'lamp' && lv.lamp) pos = { x: lv.lamp.x, y: lv.lamp.y - 12 };
    else pos = lv.spawn;

    if (g.player) { g.player.x = pos.x; g.player.y = pos.y; g.player.vx = 0; g.player.vy = 0; g.player.dead = false; }
    else g.player = new NV.Entities.Player(pos.x, pos.y);

    g.camX = Math.max(0, Math.min(lv.pxW - VW, g.player.x - VW / 2));
    g.camY = Math.max(0, lv.pxH - VH);
    g.fade = 1;
    showToast(lv.def.name, lv.def.sub);
  }

  function showToast(msg, sub) { g.toast = msg; g.toastSub = sub || ''; g.toastT = 2.4; }

  function start() {
    g.respawn = { level: 0, useLamp: false };
    g.finished = false;
    g.player = null;
    loadLevel(0, 'spawn');
    g.player.hp = 5; g.player.fulgor = 0;
  }

  g.onPlayerDeath = function () {
    // Eco de Cera simplificado: volta ao último lampião com vida cheia
    setTimeout(() => {
      const idx = g.respawn.level;
      loadLevel(idx, g.respawn.useLamp ? 'lamp' : 'spawn');
      g.player.hp = 5;
      g.player.dead = false;
      showToast('Você derreteu…', 'de volta ao último lampião');
    }, 650);
  };

  function update(dt, t) {
    if (g.fade > 0) g.fade -= dt * 3;
    if (g.toastT > 0) g.toastT -= dt;
    if (g.shake > 0) g.shake *= Math.pow(0.001, dt);
    g.lampCd -= dt;

    if (g.hitstop > 0) { g.hitstop -= dt; return; } // congela a ação (impacto)
    if (g.player.dead) return;

    g.player.update(g, dt);
    for (const e of g.enemies) if (!e.dead) e.update(g, dt);
    g.enemies = g.enemies.filter((e) => !e.dead);
    for (const pr of g.projectiles) pr.update(g, dt);
    g.projectiles = g.projectiles.filter((p) => !p.dead);
    NV.FX.update(g, dt);

    // ----- lampião: acender = ponto de retorno + cura -----
    const lp = g.level.lamp;
    if (lp && Math.abs(g.player.x - lp.x) < 30 && Math.abs(g.player.y - lp.y) < 40 && g.lampCd <= 0) {
      g.lampCd = 2;
      if (!g.lampLit) {
        g.lampLit = true;
        g.respawn = { level: g.level.index, useLamp: true };
        g.player.hp = 5;
        NV.FX.burst(g, lp.x, lp.y - 40, '#ffd98a', 20);
        if (g.level.index === NV.World.count - 1 && !g.finished) {
          g.finished = true;
          showToast('Fim do protótipo!', 'as 5 regiões foram atravessadas — obrigado por jogar');
        } else showToast('Lampião aceso', 'ponto de retorno salvo · vida restaurada');
      }
    }

    // ----- transição entre regiões -----
    if (g.player.x > g.level.pxW + 6 && g.level.index < NV.World.count - 1) {
      loadLevel(g.level.index + 1, 'left');
    } else if (g.player.x < -6 && g.level.index > 0) {
      loadLevel(g.level.index - 1, 'right');
    }
    // caiu para fora do mapa
    if (g.player.y > g.level.pxH + 80) { g.player.hurt(g, 1); if (!g.player.dead) loadLevel(g.level.index, 'spawn'); }

    // ----- câmera -----
    const tx = Math.max(0, Math.min(g.level.pxW - VW, g.player.x - VW / 2));
    const ty = Math.max(0, Math.min(g.level.pxH - VH, g.player.y - VH * 0.58));
    g.camX += (tx - g.camX) * Math.min(1, 8 * dt);
    g.camY += (ty - g.camY) * Math.min(1, 8 * dt);
  }

  return { state: g, start, update, showToast };
})();

/* Névora protótipo — orquestração: nível atual, câmera, transições, morte */
window.NV = window.NV || {};

NV.Game = (function () {
  const T = NV.World.TILE;
  const VW = 960, VH = 540;

  const g = {
    level: null, player: null,
    enemies: [], projectiles: [], particles: [], pickups: [],
    camX: 0, camY: 0, shake: 0, hitstop: 0, fade: 1,
    toast: '', toastSub: '', toastT: 0,
    lampLit: false, lampCd: 0,
    respawn: { id: 'vale', useLamp: false }, // ponto de retorno
    finished: false,
    onPlayerDeath: null,
    collectedSecrets: new Set(),
    shopOpen: false, nearNpc: false, interactCd: 0,
    playAccum: 0,
  };

  function loadLevel(id, enter) {
    const lv = NV.World.buildLevel(id, g.collectedSecrets);
    g.level = lv;
    g.enemies = lv.enemies.map((s) => NV.Entities.makeEnemy(s));
    g.projectiles = []; g.particles = []; g.pickups = [];
    g.lampLit = (g.respawn.id === id && g.respawn.useLamp);
    g.lampCd = 0; g.shopOpen = false; g.nearNpc = false;

    // enter: 'spawn' | 'lamp' | { mode:'left'|'right', y } (preserva a altura
    // Y ao atravessar pelas laterais, se houver chão/plataforma nessa altura)
    // | { mode:'fallTop'|'riseFloor', xFrac } (preserva a posição X
    // proporcional ao atravessar por um portal vertical; Y fica livre pra
    // gravidade — cai do teto ou emerge do chão, conforme a direção)
    let pos;
    if (enter && enter.mode === 'left') pos = lv.groundBelow(2, Math.floor((enter.y ?? lv.entryLeft.y) / T));
    else if (enter && enter.mode === 'right') pos = lv.groundBelow(lv.w - 3, Math.floor((enter.y ?? lv.entryRight.y) / T));
    else if (enter && enter.mode === 'fallTop') pos = lv.airTop(Math.round(enter.xFrac * lv.w));
    else if (enter && enter.mode === 'riseFloor') pos = lv.groundBelow(Math.round(enter.xFrac * lv.w), 0);
    else if (enter === 'lamp' && lv.lamp) pos = { x: lv.lamp.x, y: lv.lamp.y - 12 };
    else pos = lv.spawn;

    if (g.player) { g.player.x = pos.x; g.player.y = pos.y; g.player.vx = 0; g.player.vy = 0; g.player.dead = false; }
    else g.player = new NV.Entities.Player(pos.x, pos.y);

    g.camX = Math.max(0, Math.min(lv.pxW - VW, g.player.x - VW / 2));
    g.camY = Math.max(0, lv.pxH - VH);
    g.fade = 1;
    showToast(lv.def.name, lv.def.sub);
    NV.Audio.playMusicForRegion(id);
    NV.Save.noteRegion(id, lv.def.name);
  }

  function showToast(msg, sub) { g.toast = msg; g.toastSub = sub || ''; g.toastT = 2.4; }
  g.showToast = showToast; // entities.js chama g.showToast(...) ao coletar segredos

  function start() {
    g.respawn = { id: 'vale', useLamp: false };
    g.finished = false;
    g.player = null;
    g.collectedSecrets = new Set(NV.Save.state.secretsFound || []);
    loadLevel('vale', 'spawn');
    g.player.hp = g.player.maxHp; g.player.fulgor = 0;
  }

  g.onPlayerDeath = function () {
    NV.Audio.play('gameOver');
    NV.Save.noteDeath();
    // Eco de Cera simplificado: volta ao último lampião com vida cheia
    setTimeout(() => {
      const id = g.respawn.id;
      loadLevel(id, g.respawn.useLamp ? 'lamp' : 'spawn');
      g.player.hp = g.player.maxHp;
      g.player.dead = false;
      showToast('Você derreteu…', 'de volta ao último lampião');
    }, 650);
  };

  function update(dt, t) {
    if (g.fade > 0) g.fade -= dt * 3;
    if (g.toastT > 0) g.toastT -= dt;
    if (g.shake > 0) g.shake *= Math.pow(0.001, dt);
    g.lampCd -= dt; if (g.interactCd > 0) g.interactCd -= dt;
    g.playAccum += dt;
    if (g.playAccum >= 5) { NV.Save.addPlaySeconds(5); g.playAccum -= 5; }

    if (g.hitstop > 0) { g.hitstop -= dt; return; } // congela a ação (impacto)
    if (g.player.dead) return;

    // ----- NPC / loja: interagir pausa a simulação do mundo -----
    const npc = g.level.npc;
    g.nearNpc = !!(npc && Math.abs(g.player.x - npc.x) < 46 && Math.abs(g.player.y - npc.y) < 50);
    if (g.nearNpc && NV.Input.justPressed('interact') && g.interactCd <= 0) {
      g.shopOpen = !g.shopOpen; g.interactCd = 0.3;
      NV.Audio.play('interact');
    }
    if (g.shopOpen) return; // mundo congela enquanto a loja está aberta

    g.player.update(g, dt);
    for (const e of g.enemies) if (!e.dead) e.update(g, dt);
    g.enemies = g.enemies.filter((e) => !e.dead);
    for (const pr of g.projectiles) pr.update(g, dt);
    g.projectiles = g.projectiles.filter((p) => !p.dead);
    for (const pk of g.pickups) pk.update(g, dt);
    g.pickups = g.pickups.filter((p) => !p.dead);
    NV.FX.update(g, dt);

    // ----- segredos: coletar por proximidade -----
    for (const s of g.level.secrets) {
      if (!s.taken && Math.abs(g.player.x - s.x) < 26 && Math.abs(g.player.y - s.y) < 30) {
        g.player.collectSecret(g, s);
      }
    }

    // ----- lampião: acender = ponto de retorno + cura -----
    const lp = g.level.lamp;
    if (lp && Math.abs(g.player.x - lp.x) < 30 && Math.abs(g.player.y - lp.y) < 40 && g.lampCd <= 0) {
      g.lampCd = 2;
      if (!g.lampLit) {
        g.lampLit = true;
        g.respawn = { id: g.level.id, useLamp: true };
        g.player.hp = g.player.maxHp;
        NV.FX.burst(g, lp.x, lp.y - 40, '#ffd98a', 20);
        NV.Audio.play('lampLight');
        if (g.level.def.final && !g.finished) {
          g.finished = true;
          NV.Save.noteFinished();
          showToast('Fim do protótipo!', 'você atravessou até os Picos Uivantes — obrigado por jogar');
        } else showToast('Lampião aceso', 'ponto de retorno salvo · vida restaurada');
      }
    }

    // ----- transição entre regiões -----
    let transitioned = false;
    for (const p of g.level.portals) {
      if (g.player.x < p.x1 || g.player.x > p.x2) continue;
      const xFrac = g.player.x / g.level.pxW;
      // 'top' = saiu pelo teto (subindo) -> emerge pelo chão do destino;
      // 'bottom' = saiu pelo chão (caindo) -> cai a partir do teto do destino
      if (p.dir === 'top' && g.player.y < -20) { loadLevel(p.to, { mode: 'riseFloor', xFrac }); transitioned = true; break; }
      if (p.dir === 'bottom' && g.player.y > g.level.pxH - 4) { loadLevel(p.to, { mode: 'fallTop', xFrac }); transitioned = true; break; }
    }
    if (!transitioned) {
      const def = g.level.def;
      if (g.player.x > g.level.pxW + 6 && def.next) { loadLevel(def.next.id, { mode: 'left', y: g.player.y }); transitioned = true; }
      else if (g.player.x < -6 && def.prev) { loadLevel(def.prev.id, { mode: 'right', y: g.player.y }); transitioned = true; }
    }
    // caiu para fora do mapa (fora de qualquer portal válido)
    if (!transitioned && g.player.y > g.level.pxH + 80) {
      g.player.hurt(g, 1); if (!g.player.dead) loadLevel(g.level.id, 'spawn');
    }

    // ----- câmera -----
    const tx = Math.max(0, Math.min(g.level.pxW - VW, g.player.x - VW / 2));
    const ty = Math.max(0, Math.min(g.level.pxH - VH, g.player.y - VH * 0.58));
    g.camX += (tx - g.camX) * Math.min(1, 8 * dt);
    g.camY += (ty - g.camY) * Math.min(1, 8 * dt);
  }

  return { state: g, start, update, showToast };
})();

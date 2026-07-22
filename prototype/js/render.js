/* Névora protótipo — render com "line boil" (traço fervilhante à mão) */
window.NV = window.NV || {};
NV.wind = 0;

(function () {
  const T = NV.World.TILE;
  const VW = 960, VH = 540;

  // ---------- line boil: ruído estável que muda ~8x/segundo ----------
  let boilEpoch = 0;
  function boil(i, amp) {
    const s = Math.sin(i * 127.1 + boilEpoch * 311.7) * 43758.5453;
    return ((s - Math.floor(s)) - 0.5) * 2 * (amp || 1.6);
  }

  // ---------- partículas ----------
  const FX = {
    burst(g, x, y, color, n) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 220;
        g.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
          grav: 500, life: 0.5 + Math.random() * 0.3, max: 0.8, color, r: 2 + Math.random() * 3 });
      }
    },
    dust(g, x, y, n) {
      for (let i = 0; i < n; i++) {
        g.particles.push({ x: x + (Math.random() - 0.5) * 16, y,
          vx: (Math.random() - 0.5) * 90, vy: -Math.random() * 70,
          grav: 300, life: 0.35, max: 0.35, color: 'rgba(200,180,150,0.7)', r: 2.5 });
      }
    },
    slash(g, x, y, color) {
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2, sp = 120 + Math.random() * 180;
        g.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          grav: 0, life: 0.22, max: 0.22, color, r: 1.5 + Math.random() * 2.5 });
      }
    },
    dashTrail(g, p) {
      g.particles.push({ x: p.x, y: p.y, vx: 0, vy: 0, grav: 0,
        life: 0.22, max: 0.22, color: 'rgba(255,177,59,0.35)', r: 13, ghost: p.facing });
    },
    update(g, dt) {
      for (const pt of g.particles) {
        pt.life -= dt; pt.vy += (pt.grav || 0) * dt;
        pt.x += pt.vx * dt; pt.y += pt.vy * dt;
      }
      g.particles = g.particles.filter((p) => p.life > 0);
    },
  };
  NV.FX = FX;

  // ---------- fundo por região ----------
  function drawBackground(ctx, g, camX) {
    const th = g.level.def.theme;
    const grad = ctx.createLinearGradient(0, 0, 0, VH);
    grad.addColorStop(0, th.skyTop); grad.addColorStop(1, th.skyBot);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, VW, VH);

    // silhuetas distantes (parallax), semeadas por índice
    ctx.fillStyle = th.far;
    const shape = g.level.def.bgShape;
    for (let i = 0; i < 14; i++) {
      const bx = ((i * 173 + g.level.index * 57) % (g.level.pxW + 400)) - camX * 0.35 - 100;
      const seed = i + g.level.index * 31;
      const hgt = 120 + (seed * 37 % 160);
      if (bx < -220 || bx > VW + 120) continue;
      ctx.beginPath();
      if (shape === 'candles') {
        ctx.fillRect(bx, VH - hgt - 60, 44 + (seed % 3) * 14, hgt + 60);
        ctx.arc(bx + 22, VH - hgt - 60, 10, 0, 7);
      } else if (shape === 'ferns') {
        ctx.moveTo(bx, VH); ctx.quadraticCurveTo(bx + 30, VH - hgt - 120, bx + 90, VH - hgt - 40);
        ctx.quadraticCurveTo(bx + 50, VH - hgt + 30, bx + 60, VH); ctx.closePath();
      } else if (shape === 'stalactites') {
        ctx.moveTo(bx, 0); ctx.lineTo(bx + 26 + (seed % 20), 0); ctx.lineTo(bx + 14, 90 + (seed * 13 % 130)); ctx.closePath();
      } else if (shape === 'glasstrees') {
        ctx.fillRect(bx + 18, VH - hgt, 8, hgt);
        ctx.arc(bx + 22, VH - hgt, 26 + (seed % 12), 0, 7);
      } else { // peaks
        ctx.moveTo(bx - 80, VH); ctx.lineTo(bx + 60, VH - hgt - 120); ctx.lineTo(bx + 200, VH); ctx.closePath();
      }
      ctx.fill();
    }
  }

  // ---------- tiles ----------
  function drawTiles(ctx, g, camX, camY) {
    const lv = g.level, th = lv.def.theme;
    const x0 = Math.max(0, Math.floor(camX / T)), x1 = Math.min(lv.w - 1, Math.ceil((camX + VW) / T));
    for (let ty = 0; ty < lv.h; ty++) for (let tx = x0; tx <= x1; tx++) {
      const c = lv.cell(tx, ty);
      if (!c) continue;
      const px = tx * T - camX, py = ty * T - camY;
      if (c === 1) {
        ctx.fillStyle = th.ground;
        ctx.fillRect(px, py, T + 1, T + 1);
        if (lv.cell(tx, ty - 1) !== 1) { // borda superior exposta: traço à mão
          ctx.fillStyle = th.top;
          ctx.fillRect(px, py, T + 1, 7);
          ctx.strokeStyle = 'rgba(15,10,8,0.85)'; ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(px, py + 1 + boil(tx * 3));
          ctx.lineTo(px + T / 2, py + 1 + boil(tx * 3 + 1));
          ctx.lineTo(px + T, py + 1 + boil(tx * 3 + 2));
          ctx.stroke();
        }
      } else if (c === 2) { // plataforma vazada
        ctx.fillStyle = th.top;
        ctx.fillRect(px, py + 2, T + 1, 9);
        ctx.strokeStyle = 'rgba(15,10,8,0.8)'; ctx.lineWidth = 2;
        ctx.strokeRect(px + boil(tx), py + 2, T, 9);
      } else if (c === 3) { // espinhos
        ctx.fillStyle = th.accent;
        ctx.strokeStyle = 'rgba(15,10,8,0.9)'; ctx.lineWidth = 1.6;
        for (let s = 0; s < 3; s++) {
          const sx = px + s * (T / 3);
          ctx.beginPath();
          ctx.moveTo(sx, py + T);
          ctx.lineTo(sx + T / 6 + boil(tx + s), py + 6 + boil(tx * 7 + s));
          ctx.lineTo(sx + T / 3, py + T);
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }
      }
    }
  }

  // ---------- lampião ----------
  function drawLamp(ctx, g, camX, camY, t) {
    const lp = g.level.lamp; if (!lp) return;
    const x = lp.x - camX, y = lp.y - camY;
    const lit = g.lampLit;
    ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x + boil(1), y - 34); ctx.stroke();
    ctx.fillStyle = lit ? '#ffd98a' : '#4a4038';
    ctx.beginPath(); ctx.arc(x, y - 40, 9 + (lit ? Math.sin(t * 6) * 1.5 : 0), 0, 7); ctx.fill();
    if (lit) {
      const gr = ctx.createRadialGradient(x, y - 40, 4, x, y - 40, 70);
      gr.addColorStop(0, 'rgba(255,200,110,0.5)'); gr.addColorStop(1, 'rgba(255,200,110,0)');
      ctx.fillStyle = gr; ctx.fillRect(x - 70, y - 110, 140, 140);
    }
  }

  // ---------- jogador (gota de cera + chama) ----------
  function drawPlayer(ctx, p, camX, camY, t) {
    if (p.invuln > 0 && Math.floor(t * 18) % 2 === 0 && !p.dead) return; // pisca
    const x = p.x - camX, y = p.y - camY;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(p.facing, 1);

    // corpo: gota de cera com escorridos assimétricos
    ctx.fillStyle = '#efe3cb';
    ctx.strokeStyle = 'rgba(30,20,14,0.9)'; ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(0 + boil(1, 1), -26 + boil(2, 1));
    ctx.bezierCurveTo(13, -22, 14 + boil(3, 1), 2, 11, 17);
    ctx.bezierCurveTo(7, 20, -8, 20, -11 + boil(4, 1), 15);
    ctx.bezierCurveTo(-15, 4, -12, -20, 0 + boil(1, 1), -26 + boil(2, 1));
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // escorrido lateral (uma lateral mais derretida — regra da art bible)
    ctx.beginPath(); ctx.moveTo(-11, 8); ctx.quadraticCurveTo(-13, 14 + boil(5, 1), -10, 19);
    ctx.stroke();
    // anel de cera (cintura) em bronze
    ctx.strokeStyle = '#a97b32'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-10, 6); ctx.quadraticCurveTo(0, 9 + boil(6, 1), 11, 5); ctx.stroke();
    // olhos de brasa (metade inferior da cabeça)
    ctx.fillStyle = '#ff9d3b';
    ctx.beginPath(); ctx.arc(3, -10, 2.6, 0, 7); ctx.arc(9, -10, 2.6, 0, 7); ctx.fill();

    // pavio + chama
    ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(boil(7, 1.4), -32); ctx.stroke();
    const fh = 14 + Math.sin(t * 9 + p.flameSeed) * 2.5 + (p.fulgor / 6) * 6;
    const flick = Math.sin(t * 23 + p.flameSeed) * 2;
    const fgrad = ctx.createRadialGradient(0, -34 - fh / 3, 1, 0, -34 - fh / 3, fh);
    fgrad.addColorStop(0, '#fff3c4'); fgrad.addColorStop(0.5, '#ffb13b'); fgrad.addColorStop(1, 'rgba(210,105,30,0)');
    ctx.fillStyle = fgrad;
    ctx.beginPath();
    ctx.moveTo(-5, -31);
    ctx.quadraticCurveTo(-6 + flick, -34 - fh * 0.6, flick * 0.8, -32 - fh);
    ctx.quadraticCurveTo(6 + flick, -34 - fh * 0.6, 5, -31);
    ctx.closePath(); ctx.fill();

    // Atiçador (utensílio de bronze) durante o ataque
    if (p.atkT > 0) {
      ctx.strokeStyle = '#c89b52'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      if (p.atkDir === 'up') { ctx.moveTo(4, -20); ctx.lineTo(10, -52); }
      else if (p.atkDir === 'down') { ctx.moveTo(4, 12); ctx.lineTo(8, 46); }
      else { ctx.moveTo(8, -4); ctx.lineTo(40, -8); }
      ctx.stroke();
      // arco do golpe
      ctx.strokeStyle = 'rgba(255,220,150,0.75)'; ctx.lineWidth = 3;
      ctx.beginPath();
      if (p.atkDir === 'up') ctx.arc(0, -30, 30, -Math.PI * 0.9, -Math.PI * 0.1);
      else if (p.atkDir === 'down') ctx.arc(0, 26, 28, Math.PI * 0.1, Math.PI * 0.9);
      else ctx.arc(16, 0, 30, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---------- inimigos (encinzados: base cinza + acento da região) ----------
  function drawEnemy(ctx, e, camX, camY, t, accent) {
    if (e.dead) return;
    const x = e.x - camX, y = e.y - camY;
    ctx.save(); ctx.translate(x, y); ctx.scale(e.facing || 1, 1);
    const base = e.flash > 0 ? '#ffffff' : '#8d919b';
    const dark = e.flash > 0 ? '#ffffff' : '#5c5f68';
    ctx.strokeStyle = 'rgba(20,15,12,0.9)'; ctx.lineWidth = 2.4;

    const k = e.constructor.name;
    if (k === 'Beetle') {
      ctx.fillStyle = base;
      ctx.beginPath(); ctx.ellipse(0, 0 + boil(11, 1), 18, 12, 0, Math.PI, 0); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(14, 2, 6, 0, 7); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = accent; ctx.lineWidth = 2; // sino rachado no casco
      ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(-2, 0 + boil(12, 1)); ctx.lineTo(-8, 4); ctx.stroke();
      ctx.fillStyle = '#ffd0a0'; ctx.beginPath(); ctx.arc(16, 0, 1.8, 0, 7); ctx.fill();
    } else if (k === 'Moth') {
      const w = Math.sin(t * 18 + e.t) * 10;
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.ellipse(-4, 0, 8, 11, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = base;
      ctx.beginPath(); ctx.ellipse(-2, -8 + boil(13, 1), 14, 6 + w * 0.3, -0.5, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-2, 8 + boil(14, 1), 14, 6 - w * 0.3, 0.5, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(4, -2, 1.8, 0, 7); ctx.fill();
    } else if (k === 'Spore') {
      ctx.fillStyle = dark; ctx.fillRect(-6, -4, 12, 18); ctx.strokeRect(-6 + boil(15, 1), -4, 12, 18);
      ctx.fillStyle = base;
      ctx.beginPath(); ctx.ellipse(0, -8 + boil(16, 1), 15, 9, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(-5, -11, 2, 0, 7); ctx.arc(4, -13, 1.6, 0, 7); ctx.fill();
    } else if (k === 'GlassAnt') {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = e.flash > 0 ? '#fff' : 'rgba(200,220,230,0.6)';
      ctx.beginPath(); ctx.ellipse(-8, 0, 8, 7, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(4, -2 + boil(17, 1), 9, 7, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = accent; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(10, -6); ctx.lineTo(16, -12 + boil(18, 1)); ctx.stroke();
      ctx.globalAlpha = 1;
      if (e.state === 'windup') { ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(10, -4, 2.5, 0, 7); ctx.fill(); }
    } else if (k === 'IceWasp') {
      const w = Math.sin(t * 22 + e.t) * 8;
      ctx.fillStyle = base;
      ctx.beginPath(); ctx.ellipse(-6, 0, 11, 7, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(8, 0 + boil(19, 1), 7, 5, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(220,240,255,0.7)';
      ctx.beginPath(); ctx.ellipse(-4, -8, 9, 4 + w * 0.3, -0.4, 0, 7); ctx.fill();
      ctx.strokeStyle = accent; ctx.beginPath(); ctx.moveTo(-14, 2); ctx.lineTo(-20, 5 + boil(20, 1)); ctx.stroke();
    }
    ctx.restore();
  }

  function drawProjectile(ctx, pr, camX, camY) {
    const x = pr.x - camX, y = pr.y - camY;
    ctx.strokeStyle = 'rgba(20,15,12,0.9)'; ctx.lineWidth = 2;
    if (pr.kind === 'spore') {
      ctx.fillStyle = '#8fa4e8';
      ctx.beginPath(); ctx.arc(x, y, 6 + boil(21, 1), 0, 7); ctx.fill(); ctx.stroke();
    } else {
      ctx.fillStyle = '#cfeaff';
      ctx.beginPath();
      ctx.moveTo(x + Math.sign(pr.vx) * 10, y);
      ctx.lineTo(x - Math.sign(pr.vx) * 6, y - 4);
      ctx.lineTo(x - Math.sign(pr.vx) * 6, y + 4);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  }

  // ---------- clima ----------
  function drawWeather(ctx, g, camX, camY, t) {
    const w = g.level.def.weather;
    if (!w) return;
    if (w === 'rain') {
      ctx.strokeStyle = 'rgba(180,220,200,0.35)'; ctx.lineWidth = 1.4;
      for (let i = 0; i < 70; i++) {
        const rx = ((i * 137 + t * 520) % (VW + 60)) - 30;
        const ry = ((i * 91 + t * 780) % (VH + 40)) - 20;
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 4, ry + 14); ctx.stroke();
      }
    } else if (w === 'sand') {
      ctx.fillStyle = 'rgba(230,170,90,0.10)'; ctx.fillRect(0, 0, VW, VH);
      ctx.fillStyle = 'rgba(255,220,160,0.5)';
      for (let i = 0; i < 50; i++) {
        const rx = ((i * 173 + t * (300 + (i % 5) * 80)) % (VW + 40)) - 20;
        const ry = (i * 67) % VH + Math.sin(t * 2 + i) * 8;
        ctx.fillRect(rx, ry, 3, 1.5);
      }
    } else if (w === 'snow') {
      NV.wind = Math.sin(t * 0.4) * 55;
      ctx.fillStyle = 'rgba(240,248,255,0.8)';
      for (let i = 0; i < 60; i++) {
        const rx = ((i * 149 + t * 60 + Math.sin(t + i) * 40 + NV.wind * t) % (VW + 40) + VW + 40) % (VW + 40) - 20;
        const ry = ((i * 83 + t * (80 + (i % 4) * 30)) % (VH + 20)) - 10;
        ctx.beginPath(); ctx.arc(rx, ry, 1.5 + (i % 3) * 0.7, 0, 7); ctx.fill();
      }
    } else if (w === 'dark') {
      // escuridão com halo de luz ao redor do jogador (e do lampião)
      const p = g.player;
      const px = p.x - camX, py = p.y - camY - 20;
      ctx.save();
      ctx.fillStyle = 'rgba(4,5,10,0.86)';
      ctx.fillRect(0, 0, VW, VH);
      ctx.globalCompositeOperation = 'destination-out';
      const R = 150 + (p.fulgor / 6) * 60 + Math.sin(t * 7) * 5;
      let gr = ctx.createRadialGradient(px, py, 20, px, py, R);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gr; ctx.fillRect(px - R, py - R, R * 2, R * 2);
      if (g.level.lamp && g.lampLit) {
        const lx = g.level.lamp.x - camX, ly = g.level.lamp.y - camY - 40;
        gr = ctx.createRadialGradient(lx, ly, 10, lx, ly, 120);
        gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gr; ctx.fillRect(lx - 120, ly - 120, 240, 240);
      }
      ctx.restore();
      // brilho quente da chama por cima (para a luz "existir" na caverna)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const wr = R * 0.9;
      const wg = ctx.createRadialGradient(px, py, 6, px, py, wr);
      wg.addColorStop(0, 'rgba(255,190,110,0.34)');
      wg.addColorStop(0.5, 'rgba(255,150,70,0.12)');
      wg.addColorStop(1, 'rgba(255,150,70,0)');
      ctx.fillStyle = wg; ctx.fillRect(px - wr, py - wr, wr * 2, wr * 2);
      ctx.restore();
    }
  }

  // ---------- HUD ----------
  function drawHUD(ctx, g, t) {
    const p = g.player;
    // corações de cera
    for (let i = 0; i < 5; i++) {
      const x = 26 + i * 30, y = 28;
      ctx.strokeStyle = 'rgba(20,15,12,0.9)'; ctx.lineWidth = 2;
      ctx.fillStyle = i < p.hp ? '#efe3cb' : 'rgba(60,50,45,0.7)';
      ctx.beginPath();
      ctx.moveTo(x, y - 10 + boil(30 + i, 1));
      ctx.bezierCurveTo(x + 9, y - 4, x + 8, y + 8, x, y + 11);
      ctx.bezierCurveTo(x - 8, y + 8, x - 9, y - 4, x, y - 10 + boil(30 + i, 1));
      ctx.fill(); ctx.stroke();
      if (i < p.hp) { ctx.fillStyle = '#ffb13b'; ctx.beginPath(); ctx.arc(x, y + 2, 3, 0, 7); ctx.fill(); }
    }
    // fulgor (chama em pips)
    for (let i = 0; i < 6; i++) {
      const x = 30 + i * 18, y = 58;
      ctx.fillStyle = i < p.fulgor ? '#ffb13b' : 'rgba(70,60,50,0.7)';
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 5);
      ctx.quadraticCurveTo(x - 5, y - 3, x + boil(40 + i, 1), y - 8);
      ctx.quadraticCurveTo(x + 5, y - 3, x + 4, y + 5);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = 'rgba(232,220,200,0.55)'; ctx.font = '12px Georgia';
    ctx.fillText('FULGOR', 30, 78);

    // toast (nome da região / avisos)
    if (g.toastT > 0) {
      const a = Math.min(1, g.toastT / 0.5);
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(245,201,107,${a})`;
      ctx.font = '28px Georgia';
      ctx.fillText(g.toast, VW / 2, 84);
      if (g.toastSub) {
        ctx.fillStyle = `rgba(200,180,150,${a * 0.8})`; ctx.font = 'italic 15px Georgia';
        ctx.fillText(g.toastSub, VW / 2, 108);
      }
      ctx.textAlign = 'left';
    }
  }

  NV.Render = {
    VW, VH,
    frame(ctx, g, t, dt) {
      boilEpoch = Math.floor(t * 8);
      let camX = g.camX, camY = g.camY;
      if (g.shake > 0.5) {
        camX += (Math.random() - 0.5) * g.shake;
        camY += (Math.random() - 0.5) * g.shake;
      }
      drawBackground(ctx, g, camX);
      drawTiles(ctx, g, camX, camY);
      drawLamp(ctx, g, camX, camY, t);
      for (const e of g.enemies) drawEnemy(ctx, e, camX, camY, t, g.level.def.theme.accent);
      for (const pr of g.projectiles) drawProjectile(ctx, pr, camX, camY);
      // partículas
      for (const pt of g.particles) {
        const a = Math.max(0, pt.life / pt.max);
        ctx.globalAlpha = a;
        ctx.fillStyle = pt.color;
        ctx.beginPath(); ctx.arc(pt.x - camX, pt.y - camY, pt.r, 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
      }
      drawPlayer(ctx, g.player, camX, camY, t);
      drawWeather(ctx, g, camX, camY, t);
      drawHUD(ctx, g, t);
      // fade de transição
      if (g.fade > 0) {
        ctx.fillStyle = `rgba(8,6,8,${Math.min(1, g.fade)})`;
        ctx.fillRect(0, 0, VW, VH);
      }
    },
  };
})();

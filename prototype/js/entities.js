/* Névora protótipo — jogador, inimigos, projéteis, partículas */
window.NV = window.NV || {};

(function () {
  const T = NV.World.TILE;

  // ---------- física comum vs tiles ----------
  function collideMove(lv, e, dt) {
    // eixo X
    let nx = e.x + e.vx * dt;
    const hw = e.w / 2, hh = e.h / 2;
    const dirX = Math.sign(nx - e.x);
    if (dirX !== 0) {
      const edge = nx + dirX * hw;
      const tx = Math.floor(edge / T);
      const y0 = Math.floor((e.y - hh + 2) / T), y1 = Math.floor((e.y + hh - 2) / T);
      for (let ty = y0; ty <= y1; ty++) {
        if (lv.cell(tx, ty) === 1) {
          nx = tx * T + (dirX > 0 ? -hw - 0.01 : T + hw + 0.01);
          e.vx = 0; e.hitWall = true; break;
        }
      }
    }
    e.x = nx;

    // eixo Y
    let ny = e.y + e.vy * dt;
    const dirY = Math.sign(ny - e.y);
    e.grounded = false;
    if (dirY !== 0) {
      const edge = ny + dirY * hh;
      const ty = Math.floor(edge / T);
      const x0 = Math.floor((e.x - hw + 2) / T), x1 = Math.floor((e.x + hw - 2) / T);
      for (let tx = x0; tx <= x1; tx++) {
        const c = lv.cell(tx, ty);
        const solid = c === 1 ||
          (c === 2 && dirY > 0 && (e.y + hh) <= ty * T + 1 && !(e.dropTimer > 0));
        if (solid) {
          ny = ty * T + (dirY > 0 ? -hh - 0.01 : T + hh + 0.01);
          if (dirY > 0) e.grounded = true;
          e.vy = 0; break;
        }
      }
    }
    e.y = ny;
  }

  function overlapsSpike(lv, e) {
    const hw = e.w / 2, hh = e.h / 2;
    const x0 = Math.floor((e.x - hw) / T), x1 = Math.floor((e.x + hw) / T);
    const y0 = Math.floor((e.y - hh) / T), y1 = Math.floor((e.y + hh) / T);
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
      if (lv.cell(tx, ty) === 3) return true;
    }
    return false;
  }

  function aabb(a, b) {
    return Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
  }

  // ---------- jogador ----------
  const P = {
    SPEED: 300, ACCEL: 3200, FRICTION: 2600,
    JUMP: -640, GRAV: 1900, FALL_MULT: 1.65, TERMINAL: 900,
    COYOTE: 0.09, BUFFER: 0.12,
    DASH_V: 520, DASH_T: 0.16, DASH_CD: 0.45,
    ATK_T: 0.12, ATK_CD: 0.30,
    MAX_HP: 5, MAX_FULGOR: 6,
  };

  class Player {
    constructor(x, y) {
      this.x = x; this.y = y; this.w = 22; this.h = 38;
      this.vx = 0; this.vy = 0; this.facing = 1;
      this.grounded = false; this.coyote = 0; this.jumpBuf = 0;
      this.dashT = 0; this.dashCd = 0; this.dashAvail = true; this.dropTimer = 0;
      this.atkT = 0; this.atkCd = 0; this.atkDir = 'side'; this.atkHit = new Set();
      this.hp = P.MAX_HP; this.fulgor = 0; this.invuln = 0;
      this.dead = false; this.flameSeed = Math.random() * 10;
    }

    get dashing() { return this.dashT > 0; }

    update(g, dt) {
      const In = NV.Input, lv = g.level;
      this.coyote -= dt; this.jumpBuf -= dt; this.dashCd -= dt;
      this.atkCd -= dt; this.invuln -= dt; this.dropTimer -= dt;

      // ----- movimento horizontal -----
      const ax = (In.pressed('right') ? 1 : 0) - (In.pressed('left') ? 1 : 0);
      if (!this.dashing) {
        if (ax !== 0) {
          this.vx += ax * P.ACCEL * dt;
          this.vx = Math.max(-P.SPEED, Math.min(P.SPEED, this.vx));
          this.facing = ax;
        } else {
          const s = Math.sign(this.vx);
          this.vx -= s * P.FRICTION * dt;
          if (Math.sign(this.vx) !== s) this.vx = 0;
        }
        // vento dos Picos empurra no ar
        if (lv.def.weather === 'snow' && !this.grounded) this.vx += NV.wind * dt * 2.2;
      }

      // ----- pulo -----
      if (In.justPressed('jump')) {
        this.jumpBuf = P.BUFFER;
        if (In.pressed('down')) this.dropTimer = 0.22; // desce de plataforma vazada
      }
      if (this.jumpBuf > 0 && (this.grounded || this.coyote > 0)) {
        this.vy = P.JUMP; this.jumpBuf = 0; this.coyote = 0; this.grounded = false;
        NV.FX.dust(g, this.x, this.y + this.h / 2, 5);
      }
      if (!In.pressed('jump') && this.vy < 0) this.vy *= Math.pow(0.03, dt * 6); // corte de pulo

      // ----- dash -----
      if (In.justPressed('dash') && this.dashCd <= 0 && this.dashAvail && !this.dashing) {
        this.dashT = P.DASH_T; this.dashCd = P.DASH_CD; this.dashAvail = this.grounded;
        this.vx = this.facing * P.DASH_V; this.vy = 0;
        NV.FX.dashTrail(g, this);
      }
      if (this.dashing) {
        this.dashT -= dt; this.vy = 0;
        NV.FX.dashTrail(g, this);
      } else {
        // ----- gravidade -----
        const mult = this.vy > 0 ? P.FALL_MULT : 1;
        this.vy = Math.min(P.TERMINAL, this.vy + P.GRAV * mult * dt);
      }

      const wasGrounded = this.grounded;
      collideMove(lv, this, dt);
      if (this.grounded) { this.coyote = P.COYOTE; this.dashAvail = true; }
      else if (wasGrounded) this.coyote = P.COYOTE;
      if (this.grounded && !wasGrounded && this.vyLand > 300) NV.FX.dust(g, this.x, this.y + this.h / 2, 6);
      this.vyLand = this.vy;

      // ----- ataque -----
      if (In.justPressed('attack') && this.atkCd <= 0) {
        this.atkCd = P.ATK_CD; this.atkT = P.ATK_T; this.atkHit.clear();
        this.atkDir = (!this.grounded && In.pressed('down')) ? 'down'
          : In.pressed('up') ? 'up' : 'side';
      }
      if (this.atkT > 0) { this.atkT -= dt; this.checkAttack(g); }

      // ----- cura (Sopro Restaurador simplificado) -----
      if (In.justPressed('heal') && this.fulgor >= 3 && this.hp < P.MAX_HP) {
        this.fulgor -= 3; this.hp++;
        NV.FX.burst(g, this.x, this.y, '#ffd98a', 14);
      }

      // ----- espinhos -----
      if (overlapsSpike(lv, this) && this.invuln <= 0) {
        this.hurt(g, 1); this.vy = -420;
      }
    }

    attackBox() {
      const r = 36;
      if (this.atkDir === 'up') return { x: this.x, y: this.y - this.h / 2 - r / 2, w: 44, h: r };
      if (this.atkDir === 'down') return { x: this.x, y: this.y + this.h / 2 + r / 2, w: 40, h: r };
      return { x: this.x + this.facing * (this.w / 2 + r / 2), y: this.y - 2, w: r + 8, h: 40 };
    }

    checkAttack(g) {
      const box = this.attackBox();
      for (const en of g.enemies) {
        if (en.dead || this.atkHit.has(en)) continue;
        if (aabb(box, en)) {
          this.atkHit.add(en);
          en.hurt(g, 1, this.facing);
          this.fulgor = Math.min(P.MAX_FULGOR, this.fulgor + 1);
          g.hitstop = Math.max(g.hitstop, 0.045);
          g.shake = 4;
          NV.FX.slash(g, en.x, en.y, g.level.def.theme.accent);
          if (this.atkDir === 'down') { this.vy = -560; this.dashAvail = true; }
          else if (this.atkDir === 'side') this.vx -= this.facing * 40;
        }
      }
      for (const pr of g.projectiles) {
        if (pr.dead || this.atkHit.has(pr)) continue;
        if (aabb(box, pr)) {
          this.atkHit.add(pr); pr.dead = true;
          NV.FX.burst(g, pr.x, pr.y, '#ffffff', 8);
          if (this.atkDir === 'down') { this.vy = -560; this.dashAvail = true; }
        }
      }
    }

    hurt(g, dmg) {
      if (this.invuln > 0 || this.dashing || this.dead) return;
      this.hp -= dmg; this.invuln = 1.2;
      g.hitstop = Math.max(g.hitstop, 0.09); g.shake = 9;
      NV.FX.burst(g, this.x, this.y, '#ff8f5a', 16);
      if (this.hp <= 0) { this.dead = true; g.onPlayerDeath(); }
    }
  }

  // ---------- inimigos ----------
  class Enemy {
    constructor(x, y) {
      this.x = x; this.y = y; this.spawnX = x; this.spawnY = y;
      this.vx = 0; this.vy = 0; this.dead = false;
      this.flash = 0; this.t = Math.random() * 10; this.state = 'idle'; this.st = 0;
      this.grounded = false; this.hitWall = false; this.facing = 1;
    }
    hurt(g, dmg, dir) {
      this.hp -= dmg; this.flash = 0.12;
      if (this.fly !== true) this.vx = dir * 170;
      if (this.hp <= 0) {
        this.dead = true;
        NV.FX.burst(g, this.x, this.y, '#c9c9c9', 18);
        NV.FX.burst(g, this.x, this.y, g.level.def.theme.accent, 8);
      }
    }
    contact(g) {
      if (!this.dead && aabb(this, g.player) && g.player.invuln <= 0) {
        g.player.hurt(g, 1);
        g.player.vx = Math.sign(g.player.x - this.x) * 260; g.player.vy = -280;
      }
    }
  }

  class Beetle extends Enemy { // Vale — Besourito Sineiro
    constructor(x, y) { super(x, y); this.w = 36; this.h = 24; this.hp = 3; this.vx = 60; this.state = 'walk'; }
    update(g, dt) {
      const p = g.player, lv = g.level;
      this.t += dt; this.st -= dt; this.flash -= dt;
      this.hitWall = false;
      if (this.state === 'walk') {
        // vira na borda de plataforma
        const aheadX = this.x + Math.sign(this.vx) * (this.w / 2 + 4);
        const below = lv.cell(Math.floor(aheadX / T), Math.floor((this.y + this.h / 2 + 6) / T));
        if (below === 0) this.vx *= -1;
        const dx = p.x - this.x;
        if (Math.abs(dx) < 230 && Math.abs(p.y - this.y) < 60 && this.st <= 0) {
          this.state = 'charge'; this.st = 1.1; this.vx = Math.sign(dx) * 215;
          NV.FX.dust(g, this.x, this.y + this.h / 2, 4);
        }
      } else if (this.state === 'charge' && this.st <= 0) {
        this.state = 'walk'; this.st = 1.0; this.vx = Math.sign(this.vx) * 60;
      }
      this.vy = Math.min(900, this.vy + 1900 * dt);
      collideMove(lv, this, dt);
      if (this.hitWall) this.vx = (this.state === 'charge' ? -215 : -60) * Math.sign(this.vx || 1);
      this.facing = Math.sign(this.vx) || this.facing;
      this.contact(g);
    }
  }

  class Moth extends Enemy { // Bosque — Mariposa-Serra
    constructor(x, y) { super(x, y); this.w = 28; this.h = 22; this.hp = 2; this.fly = true; this.state = 'hover'; }
    update(g, dt) {
      const p = g.player;
      this.t += dt; this.st -= dt; this.flash -= dt;
      if (this.state === 'hover') {
        const tx = this.spawnX + Math.sin(this.t * 1.3) * 30;
        const ty = this.spawnY + Math.sin(this.t * 2.1) * 18;
        this.x += (tx - this.x) * 3 * dt; this.y += (ty - this.y) * 3 * dt;
        const d = Math.hypot(p.x - this.x, p.y - this.y);
        if (d < 210 && this.st <= 0) { this.state = 'dive'; this.st = 0.7;
          const ang = Math.atan2(p.y - this.y, p.x - this.x);
          this.vx = Math.cos(ang) * 270; this.vy = Math.sin(ang) * 270; }
      } else if (this.state === 'dive') {
        this.x += this.vx * dt; this.y += this.vy * dt;
        if (this.st <= 0) { this.state = 'return'; this.st = 1.4; }
      } else { // return
        this.x += (this.spawnX - this.x) * 1.6 * dt; this.y += (this.spawnY - this.y) * 1.6 * dt;
        if (this.st <= 0) this.state = 'hover';
      }
      this.facing = Math.sign(g.player.x - this.x) || 1;
      this.contact(g);
    }
  }

  class Spore extends Enemy { // Galerias — Esporão (torreta)
    constructor(x, y) { super(x, y); this.w = 28; this.h = 30; this.hp = 2; this.st = 1.2; }
    update(g, dt) {
      const p = g.player;
      this.t += dt; this.st -= dt; this.flash -= dt;
      const dx = p.x - this.x, dy = p.y - this.y;
      if (this.st <= 0 && Math.abs(dx) < 430 && Math.abs(dy) < 320) {
        this.st = 2.3;
        const Tf = 1.0, grav = 640;
        g.projectiles.push(new Projectile(this.x, this.y - 14,
          dx / Tf, (dy - 0.5 * grav * Tf * Tf) / Tf, grav, 'spore'));
        NV.FX.burst(g, this.x, this.y - 16, '#7f9fff', 5);
      }
      this.contact(g);
    }
  }

  class GlassAnt extends Enemy { // Vidraçal — Formiga-Vidro
    constructor(x, y) { super(x, y); this.w = 30; this.h = 20; this.hp = 1; this.vx = 95; this.state = 'walk'; }
    update(g, dt) {
      const p = g.player, lv = g.level;
      this.t += dt; this.st -= dt; this.flash -= dt; this.hitWall = false;
      if (this.state === 'walk') {
        const aheadX = this.x + Math.sign(this.vx) * (this.w / 2 + 4);
        const below = lv.cell(Math.floor(aheadX / T), Math.floor((this.y + this.h / 2 + 6) / T));
        if (below === 0 || below === 3) this.vx *= -1;
        const dx = p.x - this.x;
        if (Math.abs(dx) < 180 && Math.abs(p.y - this.y) < 50 && this.st <= 0) {
          this.state = 'windup'; this.st = 0.32; this.vx = 0; this.facing = Math.sign(dx);
        }
      } else if (this.state === 'windup') {
        if (this.st <= 0) { this.state = 'lunge'; this.st = 0.38; this.vx = this.facing * 390; }
      } else if (this.state === 'lunge' && this.st <= 0) {
        this.state = 'walk'; this.st = 0.8; this.vx = this.facing * 95;
      }
      this.vy = Math.min(900, this.vy + 1900 * dt);
      collideMove(lv, this, dt);
      if (this.hitWall) { this.state = 'walk'; this.vx = -95 * Math.sign(this.facing || 1); }
      if (this.state !== 'windup') this.facing = Math.sign(this.vx) || this.facing;
      this.contact(g);
    }
  }

  class IceWasp extends Enemy { // Picos — Vespa-Geada
    constructor(x, y) { super(x, y); this.w = 32; this.h = 22; this.hp = 2; this.fly = true; this.vx = 70; this.st = 1.0; }
    update(g, dt) {
      const p = g.player;
      this.t += dt; this.st -= dt; this.flash -= dt;
      this.x += this.vx * dt;
      this.y = this.spawnY + Math.sin(this.t * 1.8) * 10;
      if (Math.abs(this.x - this.spawnX) > 90) this.vx *= -1;
      this.facing = Math.sign(p.x - this.x) || 1;
      if (this.st <= 0 && Math.abs(p.y - this.y) < 50 && Math.abs(p.x - this.x) < 460) {
        this.st = 1.9;
        g.projectiles.push(new Projectile(this.x + this.facing * 18, this.y, this.facing * 330, 0, 0, 'ice'));
      }
      this.contact(g);
    }
  }

  class Projectile {
    constructor(x, y, vx, vy, grav, kind) {
      this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.grav = grav;
      this.kind = kind; this.w = 14; this.h = 14; this.dead = false; this.t = 0;
    }
    update(g, dt) {
      this.t += dt;
      this.vy += this.grav * dt;
      this.x += this.vx * dt; this.y += this.vy * dt;
      const c = g.level.cell(Math.floor(this.x / T), Math.floor(this.y / T));
      if (c === 1 || this.t > 5) { this.dead = true; NV.FX.burst(g, this.x, this.y, '#9fb4c8', 5); return; }
      if (aabb(this, g.player) && g.player.invuln <= 0) {
        this.dead = true; g.player.hurt(g, 1);
      }
    }
  }

  const TYPES = { beetle: Beetle, moth: Moth, spore: Spore, glass: GlassAnt, wasp: IceWasp };

  NV.Entities = {
    Player,
    makeEnemy(spec) { return new TYPES[spec.type](spec.x, spec.y); },
  };
})();

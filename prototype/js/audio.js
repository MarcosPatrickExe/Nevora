/* Névora protótipo — áudio 100% sintetizado (Web Audio API, sem downloads) */
window.NV = window.NV || {};

NV.Audio = (function () {
  let ctx = null, master = null, musicGain = null, sfxGain = null;
  let musicNodes = null, unlocked = false;
  let muted = { music: false, sfx: false };

  // volume do usuário (0..1), fatores do mix-base (0.22/0.55) — persistido
  function loadVol(key, def) {
    const v = parseFloat(localStorage.getItem(key));
    return isNaN(v) ? def : Math.max(0, Math.min(1, v));
  }
  let musicVol = loadVol('nv-vol-music', 0.6);
  let sfxVol = loadVol('nv-vol-sfx', 0.8);
  const MUSIC_BASE = 0.22, SFX_BASE = 0.55;

  function ensure() {
    if (ctx) return ctx;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = MUSIC_BASE * musicVol; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = SFX_BASE * sfxVol; sfxGain.connect(master);
    return ctx;
  }

  function unlock() {
    ensure();
    if (ctx.state === 'suspended') ctx.resume();
    unlocked = true;
  }

  function noiseBuffer(dur) {
    const n = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ---------- primitivas ----------
  function tone(freq, dur, opts) {
    if (!ctx) return;
    opts = opts || {};
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.slideTo), t0 + dur);
    const g = ctx.createGain();
    const peak = opts.gain ?? 0.5;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + (opts.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(sfxGain);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  function noiseHit(dur, opts) {
    if (!ctx) return;
    opts = opts || {};
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(dur);
    const filt = ctx.createBiquadFilter();
    filt.type = opts.filterType || 'bandpass';
    filt.frequency.setValueAtTime(opts.freq || 1200, t0);
    if (opts.slideTo) filt.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
    filt.Q.value = opts.q || 1;
    const g = ctx.createGain();
    const peak = opts.gain ?? 0.5;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filt); filt.connect(g); g.connect(sfxGain);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }

  function chord(freqs, dur, opts) { freqs.forEach((f) => tone(f, dur, opts)); }

  // ---------- efeitos do jogo (todos sintéticos) ----------
  const SFX = {
    jump() { tone(340, 0.14, { type: 'triangle', gain: 0.3, slideTo: 620, attack: 0.002 }); },
    dash() { noiseHit(0.14, { freq: 2200, slideTo: 500, gain: 0.28, q: 0.6 }); },
    attackSwing() { noiseHit(0.06, { freq: 3000, slideTo: 1200, gain: 0.18, q: 1.2 }); },
    attackHit() {
      noiseHit(0.09, { freq: 1600, slideTo: 300, gain: 0.4, q: 0.8 });
      tone(180, 0.08, { type: 'square', gain: 0.18, slideTo: 90 });
    },
    enemyDeath() { chord([220, 165, 110], 0.3, { type: 'sawtooth', gain: 0.14, slideTo: 40, attack: 0.01 }); },
    takeDamage() {
      tone(140, 0.22, { type: 'sawtooth', gain: 0.32, slideTo: 60 });
      noiseHit(0.12, { freq: 900, slideTo: 200, gain: 0.22 });
    },
    heal() { chord([440, 660, 880], 0.35, { type: 'sine', gain: 0.16, attack: 0.05 }); },
    landSoft() { noiseHit(0.05, { freq: 300, gain: 0.12, q: 0.5 }); },
    pickupSevia() { tone(700, 0.09, { type: 'sine', gain: 0.22, slideTo: 1100 }); },
    secretFound() { chord([523, 659, 784, 1046], 0.55, { type: 'triangle', gain: 0.14, attack: 0.02 }); },
    lampLight() {
      chord([392, 523, 659], 0.8, { type: 'sine', gain: 0.16, attack: 0.08 });
      tone(1200, 0.6, { type: 'sine', gain: 0.05, attack: 0.1, slideTo: 1600 });
    },
    bounce() { tone(260, 0.14, { type: 'sine', gain: 0.26, slideTo: 560, attack: 0.004 }); },
    shopBuy() { chord([523, 784], 0.25, { type: 'square', gain: 0.14, attack: 0.01 }); },
    shopDeny() { tone(180, 0.18, { type: 'square', gain: 0.2, slideTo: 120 }); },
    interact() { tone(880, 0.06, { type: 'sine', gain: 0.14 }); },
    regionEnter() { chord([220, 277, 330], 0.9, { type: 'sine', gain: 0.1, attack: 0.15 }); },
    gameOver() {
      tone(220, 1.1, { type: 'sawtooth', gain: 0.22, slideTo: 55, attack: 0.02 });
      tone(110, 1.3, { type: 'sine', gain: 0.18, slideTo: 40, attack: 0.05 });
    },
    menuClick() { tone(600, 0.05, { type: 'triangle', gain: 0.15 }); },
  };

  // ---------- pad ambiente por região (drone + arpejo melódico) ----------
  function stopMusic() {
    if (!musicNodes) return;
    if (musicNodes.melody) { musicNodes.melody.active = false; clearTimeout(musicNodes.melody.timer); }
    const t0 = ctx.currentTime;
    musicNodes.gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    const nodes = musicNodes;
    setTimeout(() => { try { nodes.osc1.stop(); nodes.osc2.stop(); nodes.lfo.stop(); } catch (e) {} }, 700);
    musicNodes = null;
  }

  // scale: semitons acima da nota-base de cada região (pentatônicas/modos
  // diferentes por bioma, pra cada região soar melodicamente distinta)
  const REGION_TONES = {
    vale: { base: 220, detune: 6, filt: 900, type: 'sine', scale: [0, 2, 4, 7, 9] },        // maior pentatônica — acolhedor
    sotao: { base: 233, detune: 4, filt: 850, type: 'sine', scale: [0, 3, 5, 7, 10] },       // menor pentatônica — mais alto
    adega: { base: 185, detune: 5, filt: 600, type: 'sine', scale: [0, 3, 5, 7, 10] },       // menor pentatônica — frio
    bosque: { base: 196, detune: 5, filt: 700, type: 'triangle', scale: [0, 2, 3, 7, 9] },   // dórico — chuva
    copas: { base: 220, detune: 3, filt: 950, type: 'triangle', scale: [0, 2, 4, 7, 9] },    // maior pentatônica — claro
    galerias: { base: 174, detune: 8, filt: 500, type: 'sine', scale: [0, 1, 5, 6, 10] },    // frígio — tenso/escuro
    vidracal: { base: 246, detune: 4, filt: 1400, type: 'sawtooth', scale: [0, 2, 5, 7, 9] }, // suspenso — deserto
    picos: { base: 261, detune: 3, filt: 1200, type: 'triangle', scale: [0, 2, 4, 6, 9] },   // lídio — frio/brilhante
  };

  function scheduleMelody(cfg, gainBus) {
    const melody = { timer: null, active: true };
    let lastDeg = -1;
    function playNote() {
      if (!melody.active) return;
      let deg = Math.floor(Math.random() * cfg.scale.length);
      if (deg === lastDeg) deg = (deg + 1) % cfg.scale.length;
      lastDeg = deg;
      const octUp = Math.random() < 0.22;
      const semis = cfg.scale[deg] + (octUp ? 12 : 0);
      const freq = cfg.base * Math.pow(2, semis / 12);
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle'; osc.frequency.value = freq;
      const g = ctx.createGain();
      const peak = octUp ? 0.08 : 0.13;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.15);
      osc.connect(g); g.connect(gainBus);
      osc.start(t0); osc.stop(t0 + 1.2);
      melody.timer = setTimeout(playNote, (0.75 + Math.random() * 0.85) * 1000);
    }
    melody.timer = setTimeout(playNote, 1200 + Math.random() * 900);
    return melody;
  }

  function playMusicForRegion(id) {
    if (!ctx || muted.music) return;
    stopMusic();
    const cfg = REGION_TONES[id] || REGION_TONES.vale;
    const t0 = ctx.currentTime;
    const gain = ctx.createGain(); gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(1, t0 + 1.5);
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = cfg.filt;
    const osc1 = ctx.createOscillator(); osc1.type = cfg.type; osc1.frequency.value = cfg.base;
    const osc2 = ctx.createOscillator(); osc2.type = cfg.type; osc2.frequency.value = cfg.base * 1.5;
    osc2.detune.value = cfg.detune;
    const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = cfg.filt * 0.35;
    lfo.connect(lfoGain); lfoGain.connect(filt.frequency);
    osc1.connect(filt); osc2.connect(filt); filt.connect(gain); gain.connect(musicGain);
    osc1.start(); osc2.start(); lfo.start();
    const melody = scheduleMelody(cfg, gain);
    musicNodes = { osc1, osc2, lfo, gain, melody };
  }

  function setMusicVolume(v) {
    musicVol = Math.max(0, Math.min(1, v));
    localStorage.setItem('nv-vol-music', musicVol);
    if (musicGain) musicGain.gain.value = MUSIC_BASE * musicVol;
  }
  function setSfxVolume(v) {
    sfxVol = Math.max(0, Math.min(1, v));
    localStorage.setItem('nv-vol-sfx', sfxVol);
    if (sfxGain) sfxGain.gain.value = SFX_BASE * sfxVol;
  }

  return {
    unlock, playMusicForRegion, stopMusic,
    play(name) { if (!ctx || muted.sfx) return; const fn = SFX[name]; if (fn) fn(); },
    get unlocked() { return unlocked; },
    toggleMusic(on) { muted.music = !on; if (!on) stopMusic(); },
    toggleSfx(on) { muted.sfx = !on; },
    setMusicVolume, setSfxVolume,
    get musicVolume() { return musicVol; },
    get sfxVolume() { return sfxVol; },
  };
})();

/* Névora protótipo — áudio 100% sintetizado (Web Audio API, sem downloads) */
window.NV = window.NV || {};

NV.Audio = (function () {
  let ctx = null, master = null, musicGain = null, sfxGain = null;
  let musicNodes = null, unlocked = false;
  let muted = { music: false, sfx: false };

  function ensure() {
    if (ctx) return ctx;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.22; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.55; sfxGain.connect(master);
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

  // ---------- pad ambiente por região (loop simples, 2 osciladores) ----------
  function stopMusic() {
    if (!musicNodes) return;
    const t0 = ctx.currentTime;
    musicNodes.gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    const nodes = musicNodes;
    setTimeout(() => { try { nodes.osc1.stop(); nodes.osc2.stop(); nodes.lfo.stop(); } catch (e) {} }, 700);
    musicNodes = null;
  }

  const REGION_TONES = [
    { base: 220, detune: 6, filt: 900, type: 'sine' },      // Vale
    { base: 196, detune: 5, filt: 700, type: 'triangle' },  // Bosque
    { base: 174, detune: 8, filt: 500, type: 'sine' },      // Galerias (escuro/grave)
    { base: 246, detune: 4, filt: 1400, type: 'sawtooth' }, // Vidraçal
    { base: 261, detune: 3, filt: 1200, type: 'triangle' }, // Picos
  ];

  function playMusicForRegion(idx) {
    if (!ctx || muted.music) return;
    stopMusic();
    const cfg = REGION_TONES[idx] || REGION_TONES[0];
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
    musicNodes = { osc1, osc2, lfo, gain };
  }

  return {
    unlock, playMusicForRegion, stopMusic,
    play(name) { if (!ctx || muted.sfx) return; const fn = SFX[name]; if (fn) fn(); },
    get unlocked() { return unlocked; },
    toggleMusic(on) { muted.music = !on; if (!on) stopMusic(); },
    toggleSfx(on) { muted.sfx = !on; },
  };
})();

/* Névora protótipo — definição das 5 regiões e colisão de tiles */
window.NV = window.NV || {};

NV.World = (function () {
  const TILE = 32;
  const H = 17; // linhas

  // ---------- helpers de construção de mapa ----------
  function grid(w) { return Array.from({ length: H }, () => Array(w).fill('.')); }
  function fill(g, x1, y1, x2, y2, ch) {
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) {
      if (g[y] && g[y][x] !== undefined) g[y][x] = ch;
    }
  }
  function put(g, x, y, ch) { if (g[y] && g[y][x] !== undefined) g[y][x] = ch; }

  // ---------- as 5 regiões ----------
  // themes: cores base; weather: efeito climático; enemy: tipo típico
  const LEVELS = [
    {
      name: 'Vale das Velas', sub: 'região inicial',
      theme: { skyTop: '#3a2436', skyBot: '#8a4b2e', ground: '#4a3627', top: '#6b4d33', far: '#2a1c26', accent: '#ffb13b' },
      weather: null, enemy: 'beetle', bgShape: 'candles',
      build() {
        const w = 60, g = grid(w);
        fill(g, 0, 0, 0, H - 1, '#');            // parede esquerda (início do mundo)
        fill(g, 0, 15, w - 1, 16, '#');          // chão
        fill(g, 10, 12, 15, 12, '#');            // plataforma baixa
        fill(g, 18, 9, 22, 9, '=');              // plataforma vazada
        fill(g, 26, 13, 29, 13, '#');            // degrau
        fill(g, 38, 11, 43, 11, '#');            // plataforma alta
        put(g, 3, 14, 'P');
        put(g, 6, 14, 'L');
        put(g, 21, 14, 'e'); put(g, 34, 14, 'e'); put(g, 40, 10, 'e'); put(g, 50, 14, 'e');
        return g;
      },
    },
    {
      name: 'Bosque Murmurante', sub: 'chuva e vento',
      theme: { skyTop: '#16281e', skyBot: '#3f6844', ground: '#2f4630', top: '#4c6b42', far: '#0f1d16', accent: '#7fd07f' },
      weather: 'rain', enemy: 'moth', bgShape: 'ferns',
      build() {
        const w = 60, g = grid(w);
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 6, 12, 11, 12, '=');
        fill(g, 15, 10, 20, 10, '=');
        fill(g, 24, 8, 28, 8, '=');
        fill(g, 33, 11, 38, 11, '=');
        fill(g, 44, 9, 49, 9, '=');
        put(g, 30, 14, 'L');
        put(g, 18, 7, 'e'); put(g, 27, 6, 'e'); put(g, 36, 8, 'e'); put(g, 47, 6, 'e');
        return g;
      },
    },
    {
      name: 'Galerias Fúngicas', sub: 'a luz é sua',
      theme: { skyTop: '#0b0d18', skyBot: '#1a2036', ground: '#242a3e', top: '#38405c', far: '#070810', accent: '#7f9fff' },
      weather: 'dark', enemy: 'spore', bgShape: 'stalactites',
      build() {
        const w = 60, g = grid(w);
        fill(g, 0, 0, w - 1, 1, '#');             // teto de caverna
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 14, 2, 14, 6, '#');               // estalactites-coluna
        fill(g, 44, 2, 44, 7, '#');
        fill(g, 30, 11, 30, 14, '#');             // pilar
        fill(g, 8, 11, 12, 11, '#');
        fill(g, 20, 12, 25, 12, '#');
        fill(g, 34, 10, 39, 10, '#');
        fill(g, 48, 12, 53, 12, '#');
        put(g, 4, 14, 'L');
        put(g, 10, 10, 'e'); put(g, 22, 11, 'e'); put(g, 36, 9, 'e'); put(g, 50, 11, 'e');
        return g;
      },
    },
    {
      name: 'Vidraçal', sub: 'deserto de vidro',
      theme: { skyTop: '#7a3d1c', skyBot: '#e0a04c', ground: '#8a5a30', top: '#c08448', far: '#5a2c16', accent: '#ffd98a' },
      weather: 'sand', enemy: 'glass', bgShape: 'glasstrees',
      build() {
        const w = 60, g = grid(w);
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 18, 14, 20, 14, '^');             // espinhos de vidro
        fill(g, 40, 14, 42, 14, '^');
        fill(g, 12, 12, 16, 12, '#');
        fill(g, 22, 10, 27, 10, '=');
        fill(g, 36, 12, 39, 12, '#');
        fill(g, 44, 10, 48, 10, '=');
        put(g, 6, 14, 'L');
        put(g, 10, 14, 'e'); put(g, 30, 14, 'e'); put(g, 34, 14, 'e'); put(g, 52, 14, 'e');
        return g;
      },
    },
    {
      name: 'Picos Uivantes', sub: 'o vento empurra',
      theme: { skyTop: '#1c2a44', skyBot: '#7fa8c8', ground: '#8fa4b8', top: '#c8d8e8', far: '#152036', accent: '#aef0ff' },
      weather: 'snow', enemy: 'wasp', bgShape: 'peaks',
      build() {
        const w = 60, g = grid(w);
        fill(g, w - 1, 0, w - 1, H - 1, '#');     // parede direita (fim do protótipo)
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 24, 14, 26, 14, '^');
        fill(g, 44, 14, 46, 14, '^');
        fill(g, 10, 12, 14, 12, '#');
        fill(g, 20, 9, 24, 9, '=');
        fill(g, 30, 11, 34, 11, '#');
        fill(g, 40, 8, 44, 8, '=');
        fill(g, 50, 12, 55, 12, '#');
        put(g, 56, 14, 'L');                       // lampião final
        put(g, 16, 6, 'e'); put(g, 32, 5, 'e'); put(g, 48, 7, 'e');
        return g;
      },
    },
  ];

  // ---------- parse de um nível para estruturas de jogo ----------
  function buildLevel(i) {
    const def = LEVELS[i];
    const g = def.build();
    const w = g[0].length;
    const solids = new Uint8Array(w * H);   // 1 sólido, 2 vazada (one-way), 3 espinho
    const enemies = [];
    let spawn = null, lamp = null;

    for (let y = 0; y < H; y++) for (let x = 0; x < w; x++) {
      const c = g[y][x];
      if (c === '#') solids[y * w + x] = 1;
      else if (c === '=') solids[y * w + x] = 2;
      else if (c === '^') solids[y * w + x] = 3;
      else if (c === 'P') spawn = { x: x * TILE + 16, y: y * TILE + 16 };
      else if (c === 'L') lamp = { x: x * TILE + 16, y: y * TILE + 16 };
      else if (c === 'e') enemies.push({ type: def.enemy, x: x * TILE + 16, y: y * TILE + 16 });
    }

    // pontos de entrada pelas bordas (procura o chão de baixo para cima,
    // ignorando tetos de caverna)
    function groundAt(col) {
      for (let y = H - 1; y >= 1; y--) {
        if (solids[y * w + col] === 1 && solids[(y - 1) * w + col] !== 1) {
          return { x: col * TILE + 16, y: y * TILE - 20 };
        }
      }
      return { x: col * TILE + 16, y: 14 * TILE };
    }
    const entryLeft = groundAt(2);
    const entryRight = groundAt(w - 3);

    return {
      index: i, def, w, h: H, solids,
      pxW: w * TILE, pxH: H * TILE,
      enemies, spawn: spawn || entryLeft, lamp,
      entryLeft, entryRight,
      cell(tx, ty) {
        if (tx < 0 || tx >= w || ty < 0 || ty >= H) return 0;
        return solids[ty * w + tx];
      },
    };
  }

  return { TILE, H, LEVELS, buildLevel, count: LEVELS.length };
})();

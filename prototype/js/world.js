/* Névora protótipo — definição das regiões (grafo, não corrente linear) e
   colisão de tiles. Cada região tem um id; `prev`/`next` ligam a cadeia
   principal (mesmo formato de sempre — esquerda/direita), e `portals` liga
   saídas verticais (topo/fundo) a regiões-atalho que devolvem à cadeia
   principal em outro ponto (ver docs/03-mundo/MAPA.md, seção do protótipo). */
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

  // ---------- as 8 regiões do protótipo ----------
  // themes: cores base; weather: efeito climático; enemy: tipo típico
  // prev/next: cadeia principal (esquerda/direita, como sempre existiu)
  // portals: saídas verticais (topo/fundo) pra regiões-atalho; x1/x2 em tiles
  // updrafts: zonas de empuxo pra cima (x1/x2 em tiles); vine ('V') e bounce
  // pad ('O') são tiles especiais desenhados direto na grade
  const LEVELS = [
    {
      id: 'vale', name: 'Vale das Velas', sub: 'região inicial',
      theme: { skyTop: '#3a2436', skyBot: '#8a4b2e', ground: '#4a3627', top: '#6b4d33', far: '#2a1c26', accent: '#ffb13b' },
      weather: 'embers', enemy: 'beetle', bgShape: 'candles',
      npc: { x: 9, y: 14, type: 'tio_sebo' },
      secrets: [{ x: 52, y: 6, item: 'fragment', id: 'vale-fragmento' }],
      next: { id: 'bosque' },
      portals: [
        { dir: 'top', x1: 32, x2: 35, to: 'sotao' },   // brasas sobem até o Sótão do Sineiro
        { dir: 'bottom', x1: 15, x2: 17, to: 'adega' }, // alçapão desce até a Adega de Cera
      ],
      updrafts: [{ x1: 32, x2: 35 }],
      build() {
        const w = 60, g = grid(w);
        fill(g, 0, 0, 0, H - 1, '#');            // parede esquerda (início do mundo)
        fill(g, 0, 15, w - 1, 16, '#');          // chão
        fill(g, 10, 12, 15, 12, '#');            // plataforma baixa
        fill(g, 18, 9, 22, 9, '=');              // plataforma vazada
        fill(g, 26, 13, 29, 13, '#');            // degrau
        fill(g, 38, 11, 43, 11, '#');            // plataforma alta
        fill(g, 47, 9, 48, 9, '#');              // trampolim escondido p/ o segredo
        fill(g, 51, 7, 53, 7, '#');               // ledge do segredo
        fill(g, 15, 15, 17, 16, '.');            // alçapão — buraco no chão até a Adega
        put(g, 3, 14, 'P');
        put(g, 6, 14, 'L');
        put(g, 21, 14, 'e'); put(g, 34, 14, 'e'); put(g, 40, 10, 'e'); put(g, 50, 14, 'e');
        return g;
      },
    },
    {
      id: 'sotao', name: 'Sótão do Sineiro', sub: 'entre vigas e sinos de cera',
      theme: { skyTop: '#2c1e2a', skyBot: '#6b4530', ground: '#453022', top: '#6b4d33', far: '#22171f', accent: '#f5c96b' },
      weather: null, enemy: 'beetle', bgShape: 'candles',
      secrets: [{ x: 20, y: 6, item: 'fragment', id: 'sotao-fragmento' }],
      next: { id: 'galerias' },
      build() {
        const w = 26, g = grid(w);
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 6, 12, 10, 12, '#');
        fill(g, 14, 9, 18, 9, '=');
        fill(g, 20, 7, 22, 7, '#');               // ledge do segredo
        return g;
      },
    },
    {
      id: 'adega', name: 'Adega de Cera', sub: 'barris frios de reserva',
      theme: { skyTop: '#141826', skyBot: '#33405a', ground: '#2a2c3a', top: '#454d63', far: '#0e1018', accent: '#8fb0d8' },
      weather: null, enemy: 'beetle', bgShape: 'candles',
      secrets: [{ x: 20, y: 11, item: 'fragment', id: 'adega-fragmento' }],
      next: { id: 'vidracal' },
      build() {
        const w = 26, g = grid(w);
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 8, 13, 12, 13, '#');
        fill(g, 16, 12, 19, 12, '=');
        fill(g, 19, 11, 21, 11, '#');             // ledge do segredo
        return g;
      },
    },
    {
      id: 'bosque', name: 'Bosque Murmurante', sub: 'chuva e vento',
      theme: { skyTop: '#16281e', skyBot: '#3f6844', ground: '#2f4630', top: '#4c6b42', far: '#0f1d16', accent: '#7fd07f' },
      weather: 'rain', enemy: 'moth', bgShape: 'ferns',
      prev: { id: 'vale' }, next: { id: 'galerias' },
      portals: [{ dir: 'top', x1: 52, x2: 53, to: 'copas' }], // cipó sobe até a Copa do Bosque
      build() {
        const w = 60, g = grid(w);
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 6, 12, 11, 12, '=');
        fill(g, 15, 10, 20, 10, '=');
        fill(g, 24, 8, 28, 8, '=');
        fill(g, 33, 11, 38, 11, '=');
        fill(g, 44, 9, 49, 9, '=');
        fill(g, 52, 0, 52, 14, 'V');              // cipó — sobe até a Copa do Bosque
        put(g, 30, 14, 'L');
        put(g, 18, 7, 'e'); put(g, 27, 6, 'e'); put(g, 36, 8, 'e'); put(g, 47, 6, 'e');
        return g;
      },
    },
    {
      id: 'copas', name: 'Copas do Bosque', sub: 'trilha entre cipós, no alto',
      theme: { skyTop: '#0e2416', skyBot: '#3a7a48', ground: '#274a2c', top: '#4f8a52', far: '#0a1a10', accent: '#c7f07f' },
      weather: null, enemy: 'moth', bgShape: 'ferns',
      secrets: [{ x: 24, y: 8, item: 'fragment', id: 'copas-fragmento' }],
      next: { id: 'picos' },
      build() {
        const w = 30, g = grid(w);
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 6, 12, 10, 12, '=');
        fill(g, 13, 9, 17, 9, '=');
        fill(g, 22, 7, 26, 7, '#');
        put(g, 15, 6, 'e');
        return g;
      },
    },
    {
      id: 'galerias', name: 'Galerias Fúngicas', sub: 'a luz é sua',
      theme: { skyTop: '#0b0d18', skyBot: '#1a2036', ground: '#242a3e', top: '#38405c', far: '#070810', accent: '#7f9fff' },
      weather: 'dark', enemy: 'spore', bgShape: 'stalactites',
      secrets: [{ x: 26, y: 4, item: 'boot', id: 'galerias-bota' }],
      prev: { id: 'bosque' }, next: { id: 'vidracal' },
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
        fill(g, 24, 8, 24, 8, '#');                // trampolim escondido (só visível com luz)
        fill(g, 26, 5, 27, 5, '#');                // ledge do segredo
        put(g, 17, 15, 'O');                       // cogumelo-mola (recurso próprio da região)
        put(g, 4, 14, 'L');
        put(g, 10, 10, 'e'); put(g, 22, 11, 'e'); put(g, 36, 9, 'e'); put(g, 50, 11, 'e');
        return g;
      },
    },
    {
      id: 'vidracal', name: 'Vidraçal', sub: 'deserto de vidro',
      theme: { skyTop: '#7a3d1c', skyBot: '#e0a04c', ground: '#8a5a30', top: '#c08448', far: '#5a2c16', accent: '#ffd98a' },
      weather: 'sand', enemy: 'glass', bgShape: 'glasstrees',
      secrets: [{ x: 49, y: 4, item: 'fragment', id: 'vidracal-fragmento' }],
      prev: { id: 'galerias' }, next: { id: 'picos' },
      // o vórtice desliga perto da ledge (y1, em px — menor y = mais alto)
      // — a inércia residual completa a subida e a gravidade assenta o
      // jogador na plataforma vazada
      updrafts: [{ x1: 48, x2: 50, y1: 150 }],
      build() {
        const w = 60, g = grid(w);
        fill(g, 0, 15, w - 1, 16, '#');
        fill(g, 18, 14, 20, 14, '^');             // espinhos de vidro
        fill(g, 40, 14, 42, 14, '^');
        fill(g, 12, 12, 16, 12, '#');
        fill(g, 22, 10, 27, 10, '=');
        fill(g, 36, 12, 39, 12, '#');
        fill(g, 44, 10, 48, 10, '=');
        fill(g, 47, 5, 50, 5, '=');               // ledge do segredo (alcançada pelo vórtice de areia)
        put(g, 6, 14, 'L');
        put(g, 10, 14, 'e'); put(g, 30, 14, 'e'); put(g, 34, 14, 'e'); put(g, 52, 14, 'e');
        return g;
      },
    },
    {
      id: 'picos', name: 'Picos Uivantes', sub: 'o vento empurra',
      theme: { skyTop: '#1c2a44', skyBot: '#7fa8c8', ground: '#8fa4b8', top: '#c8d8e8', far: '#152036', accent: '#aef0ff' },
      weather: 'snow', enemy: 'wasp', bgShape: 'peaks',
      secrets: [{ x: 37, y: 5, item: 'fragment', id: 'picos-fragmento' }],
      prev: { id: 'vidracal' }, final: true,
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
        fill(g, 36, 6, 38, 6, '#');                 // ledge escondida atrás do vento
        put(g, 56, 14, 'L');                       // lampião final
        put(g, 16, 6, 'e'); put(g, 32, 5, 'e'); put(g, 48, 7, 'e');
        return g;
      },
    },
  ];

  const LEVELS_BY_ID = {};
  LEVELS.forEach((def, i) => { def.index = i; LEVELS_BY_ID[def.id] = def; });

  // ---------- parse de um nível para estruturas de jogo ----------
  function buildLevel(id, collectedSecrets) {
    const def = LEVELS_BY_ID[id];
    const g = def.build();
    const w = g[0].length;
    // 1 sólido, 2 vazada (one-way), 3 espinho, 4 cipó (climbável), 5 bounce pad
    const solids = new Uint8Array(w * H);
    const enemies = [];
    let spawn = null, lamp = null;

    for (let y = 0; y < H; y++) for (let x = 0; x < w; x++) {
      const c = g[y][x];
      if (c === '#') solids[y * w + x] = 1;
      else if (c === '=') solids[y * w + x] = 2;
      else if (c === '^') solids[y * w + x] = 3;
      else if (c === 'V') solids[y * w + x] = 4;
      else if (c === 'O') solids[y * w + x] = 5;
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

    const secrets = (def.secrets || [])
      .filter((s) => !collectedSecrets || !collectedSecrets.has(s.id))
      .map((s) => ({ ...s, x: s.x * TILE + 16, y: s.y * TILE + 16, taken: false }));
    const npc = def.npc ? { ...def.npc, x: def.npc.x * TILE + 16, y: def.npc.y * TILE + 16 } : null;
    const portals = (def.portals || []).map((p) => ({ ...p, x1: p.x1 * TILE, x2: p.x2 * TILE }));
    const updrafts = (def.updrafts || []).map((u) => ({ ...u, x1: u.x1 * TILE, x2: u.x2 * TILE }));

    return {
      id, index: def.index, def, w, h: H, solids,
      pxW: w * TILE, pxH: H * TILE,
      enemies, spawn: spawn || entryLeft, lamp, secrets, npc, portals, updrafts,
      entryLeft, entryRight,
      cell(tx, ty) {
        if (tx < 0 || tx >= w || ty < 0 || ty >= H) return 0;
        return solids[ty * w + tx];
      },
    };
  }

  return { TILE, H, LEVELS, LEVELS_BY_ID, buildLevel, count: LEVELS.length };
})();

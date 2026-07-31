/* Névora protótipo — tela de Mapa, no espírito do mapa do Hollow Knight/
   Silksong: cada região é desenhada com o contorno real do seu terreno
   (chão, plataformas, "chaminés" de portal) — não um círculo ou retângulo
   genérico — conectadas pela topologia real (derivada de NV.World.LEVELS,
   sem duplicar dados).

   Sistema de coordenadas: todas as constantes abaixo (POS, fw, fh) são
   autoradas como porcentagem (0–100) tanto em X quanto em Y, por serem
   mais intuitivas de ajustar à mão. O viewBox do SVG usa uma largura maior
   que 100 (VBW) pra casar com a proporção real do container (mais largo
   que alto) — toVX() converte porcentagem-X pra unidade de viewBox; Y não
   precisa converter (VBH = 100, já é 1:1 com porcentagem). */
window.NV = window.NV || {};

NV.MapUI = (function () {
  const T = () => NV.World.TILE;
  const VBW = 220, VBH = 100; // deve casar com aspect-ratio do .map-graph no CSS
  const toVX = (pct) => (pct / 100) * VBW;

  // âncoras (%) hand-tuned pra espelhar o diagrama de docs/03-mundo/MAPA.md
  const POS = {
    vale: [10, 52], bosque: [31, 52], galerias: [53, 52], vidracal: [75, 52], picos: [92, 52],
    sotao: [31, 16], copas: [64, 16],
    adega: [42, 87],
  };
  const MAIN = new Set(['vale', 'bosque', 'galerias', 'vidracal', 'picos']);

  let root = null, built = false;

  function edges() {
    const list = [];
    for (const def of NV.World.LEVELS) {
      if (def.next) list.push([def.id, def.next.id]);
      if (def.portals) for (const p of def.portals) list.push([def.id, p.to]);
    }
    return list;
  }

  // ---------- traça o contorno real do terreno de uma região ----------
  function profile(id) {
    const lv = NV.World.buildLevel(id, new Set());
    const w = lv.w, H = lv.h, solids = lv.solids;
    const floor = new Array(w), top = new Array(w);
    for (let x = 0; x < w; x++) {
      let floorY = H - 1;
      for (let y = H - 1; y >= 0; y--) { if (solids[y * w + x] === 1) { floorY = y; break; } }
      // o bloco de chão pode ter mais de 1 tile de espessura — sobe até
      // encontrar a superfície de verdade antes de procurar a próxima
      // obstrução (senão a 2ª camada do próprio chão vira "teto falso")
      let surf = floorY;
      while (surf > 0 && solids[(surf - 1) * w + x] === 1) surf--;
      let topY = Math.max(0, surf - 3); // teto "de headroom" padrão
      for (let y = surf - 1; y >= 0; y--) {
        const c = solids[y * w + x];
        if (c === 1 || c === 2) { topY = y + 1; break; } // bateu numa plataforma/teto de verdade
      }
      floor[x] = floorY; top[x] = topY;
    }
    // portais de saída pelo topo viram "chaminés" que sobem até o fim da tela
    for (const p of lv.def.portals || []) {
      if (p.dir !== 'top') continue;
      const x1 = Math.round(p.x1 / T()), x2 = Math.round(p.x2 / T());
      for (let x = Math.max(0, x1); x <= Math.min(w - 1, x2); x++) top[x] = 0;
    }
    return { w, floor, top };
  }

  // cx/cy em % (0–100); fwPct/fh em % de largura/altura do viewBox
  function shapePath(prof, cxPct, cyPct, fwPct, fh) {
    const { w, floor, top } = prof;
    const minTop = Math.min(...top), maxFloor = Math.max(...floor);
    const spanY = Math.max(1, maxFloor - minTop);
    const cx = toVX(cxPct), fw = toVX(fwPct);
    const x0 = cx - fw / 2, y0 = cyPct - fh / 2;
    const sx = fw / (w - 1), sy = fh / spanY;
    const topPts = [], floorPts = [];
    for (let x = 0; x < w; x++) {
      const px = x0 + x * sx;
      topPts.push([px, y0 + (top[x] - minTop) * sy]);
      floorPts.push([px, y0 + (floor[x] - minTop) * sy]);
    }
    let d = `M ${topPts[0][0].toFixed(1)},${topPts[0][1].toFixed(1)} `;
    for (const [px, py] of topPts) d += `L ${px.toFixed(1)},${py.toFixed(1)} `;
    for (let i = floorPts.length - 1; i >= 0; i--) d += `L ${floorPts[i][0].toFixed(1)},${floorPts[i][1].toFixed(1)} `;
    return d + 'Z';
  }

  function build() {
    if (built || !root) return;
    built = true;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'map-svg');
    svg.setAttribute('viewBox', `0 0 ${VBW} ${VBH}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    const edgeLayer = document.createElementNS(svgNS, 'g'); edgeLayer.setAttribute('class', 'map-edge-layer');
    const shapeLayer = document.createElementNS(svgNS, 'g'); shapeLayer.setAttribute('class', 'map-shape-layer');
    const labelLayer = document.createElementNS(svgNS, 'g'); labelLayer.setAttribute('class', 'map-label-layer');
    svg.appendChild(edgeLayer); svg.appendChild(shapeLayer); svg.appendChild(labelLayer);

    for (const [a, b] of edges()) {
      const [x1, y1] = POS[a], [x2, y2] = POS[b];
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', toVX(x1)); line.setAttribute('y1', y1);
      line.setAttribute('x2', toVX(x2)); line.setAttribute('y2', y2);
      line.dataset.a = a; line.dataset.b = b;
      edgeLayer.appendChild(line);
    }

    for (const def of NV.World.LEVELS) {
      const [cx, cy] = POS[def.id];
      const main = MAIN.has(def.id);
      const prof = profile(def.id);
      const fwPct = main ? 15 : 8 + (prof.w - 26) * 0.2;
      const fh = main ? 16 : 12;
      const d = shapePath(prof, cx, cy, fwPct, fh);

      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'map-shape');
      path.dataset.id = def.id;
      path.style.setProperty('--rc', def.theme.accent);
      shapeLayer.appendChild(path);

      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', toVX(cx)); label.setAttribute('y', cy + fh / 2 + 7);
      label.setAttribute('class', 'map-label');
      label.dataset.id = def.id;
      label.textContent = def.name;
      labelLayer.appendChild(label);

      const marker = document.createElementNS(svgNS, 'circle');
      marker.setAttribute('cx', toVX(cx)); marker.setAttribute('cy', cy);
      marker.setAttribute('r', 1.6);
      marker.setAttribute('class', 'map-current-marker');
      marker.dataset.id = def.id;
      shapeLayer.appendChild(marker);
    }
    root.appendChild(svg);
  }

  function refresh() {
    if (!root) return;
    build();
    const visited = new Set(NV.Save.state.regionsVisited || []);
    const curId = NV.Game.state.level ? NV.Game.state.level.id : null;
    root.querySelectorAll('.map-shape, .map-label').forEach((el) => {
      const id = el.dataset.id;
      el.classList.toggle('map-visited', visited.has(id));
      el.classList.toggle('map-current', id === curId);
    });
    root.querySelectorAll('.map-current-marker').forEach((el) => {
      el.classList.toggle('map-current', el.dataset.id === curId);
    });
    root.querySelectorAll('.map-edge-layer line').forEach((line) => {
      const seen = visited.has(line.dataset.a) && visited.has(line.dataset.b);
      line.classList.toggle('map-edge-seen', seen);
    });
  }

  return {
    init(container) { root = container; },
    refresh,
  };
})();

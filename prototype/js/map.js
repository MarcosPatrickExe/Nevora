/* Névora protótipo — tela de Mapa: mostra o grafo de regiões (derivado
   direto de NV.World.LEVELS — next/portals), com a região atual destacada
   e as já visitadas marcadas, pra ajudar a navegação multi-caminho. */
window.NV = window.NV || {};

NV.MapUI = (function () {
  // posições (%) hand-tuned pra espelhar o diagrama de docs/03-mundo/MAPA.md
  const POS = {
    vale: [8, 52], bosque: [30, 52], galerias: [52, 52], vidracal: [74, 52], picos: [93, 52],
    sotao: [30, 15], copas: [64, 15],
    adega: [41, 88],
  };

  let root = null, built = false;

  function edges() {
    const list = [];
    for (const def of NV.World.LEVELS) {
      if (def.next) list.push([def.id, def.next.id]);
      if (def.portals) for (const p of def.portals) list.push([def.id, p.to]);
    }
    return list;
  }

  function build() {
    if (built || !root) return;
    built = true;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'map-edges');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    for (const [a, b] of edges()) {
      const [x1, y1] = POS[a], [x2, y2] = POS[b];
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x1); line.setAttribute('y1', y1);
      line.setAttribute('x2', x2); line.setAttribute('y2', y2);
      line.dataset.a = a; line.dataset.b = b;
      svg.appendChild(line);
    }
    root.appendChild(svg);

    for (const def of NV.World.LEVELS) {
      const [x, y] = POS[def.id];
      const node = document.createElement('div');
      node.className = 'map-node';
      node.dataset.id = def.id;
      node.style.left = x + '%'; node.style.top = y + '%';
      node.style.setProperty('--dotc', def.theme.accent);
      node.innerHTML = `<span class="map-dot"></span><span class="map-label">${def.name}</span>`;
      root.appendChild(node);
    }
  }

  function refresh() {
    if (!root) return;
    build();
    const visited = new Set(NV.Save.state.regionsVisited || []);
    const curId = NV.Game.state.level ? NV.Game.state.level.id : null;
    root.querySelectorAll('.map-node').forEach((node) => {
      const id = node.dataset.id;
      node.classList.toggle('map-visited', visited.has(id));
      node.classList.toggle('map-current', id === curId);
    });
    root.querySelectorAll('.map-edges line').forEach((line) => {
      const seen = visited.has(line.dataset.a) && visited.has(line.dataset.b);
      line.classList.toggle('map-edge-seen', seen);
    });
  }

  return {
    init(container) { root = container; },
    refresh,
  };
})();

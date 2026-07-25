/* Névora protótipo — nickname + progresso local (rota simples, sem backend) */
window.NV = window.NV || {};

NV.Save = (function () {
  const KEY = 'nv-progress-v2';

  function empty() {
    return {
      nickname: '', createdAt: Date.now(),
      furthestRegion: 0, furthestRegionName: 'Vale das Velas',
      deaths: 0, enemiesDefeated: 0, seviaCollected: 0,
      secretsFound: [], upgradesBought: [], finishedRun: false,
      playSeconds: 0,
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const d = JSON.parse(raw);
      return Object.assign(empty(), d);
    } catch (e) { return empty(); }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  let state = load();

  function setNickname(name) {
    state.nickname = (name || '').trim().slice(0, 24) || 'Acendedor Anônimo';
    save(state);
  }

  function noteRegion(idx, name) {
    if (idx > state.furthestRegion) { state.furthestRegion = idx; state.furthestRegionName = name; save(state); }
  }
  function noteDeath() { state.deaths++; save(state); }
  function noteEnemyDefeated() { state.enemiesDefeated++; save(state); }
  function noteSevia(n) { state.seviaCollected += n; save(state); }
  function noteSecret(id) { if (!state.secretsFound.includes(id)) { state.secretsFound.push(id); save(state); } }
  function noteUpgrade(id) { if (!state.upgradesBought.includes(id)) { state.upgradesBought.push(id); save(state); } }
  function noteFinished() { state.finishedRun = true; save(state); }
  function addPlaySeconds(s) { state.playSeconds += s; save(state); }

  function summaryText() {
    const mins = Math.round(state.playSeconds / 60);
    return [
      `Névora — resumo de ${state.nickname || 'jogador'}`,
      `Região mais distante: ${state.furthestRegionName} (${state.furthestRegion + 1}/5)`,
      `Inimigos derrotados: ${state.enemiesDefeated}`,
      `Sévia coletada: ${state.seviaCollected}`,
      `Segredos encontrados: ${state.secretsFound.length}`,
      `Upgrades comprados: ${state.upgradesBought.length}`,
      `Mortes: ${state.deaths}`,
      `Tempo jogado: ~${mins} min`,
      state.finishedRun ? 'Zerou o protótipo! 🕯️' : '',
    ].filter(Boolean).join('\n');
  }

  return {
    get state() { return state; },
    setNickname, noteRegion, noteDeath, noteEnemyDefeated, noteSevia,
    noteSecret, noteUpgrade, noteFinished, addPlaySeconds, summaryText,
  };
})();

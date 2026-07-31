/* Névora protótipo — dados das 6 classes jogáveis (Acendedores).
   Fonte: docs/art/ACENDEDORES_REDESIGN.md (retrato/paleta/personalidade) +
   docs/04-gameplay/CLASSES_ACENDEDORES.md (papel/passiva). Escolha de classe
   é permanente por save (ver NV.Save.setClass) — a cor da chama identifica
   a classe (regra de design, não só estética). Neste protótipo greybox só a
   passiva de cada classe está implementada; as 2 ativas + técnica exclusiva
   de cada uma ficam para uma fase futura (ver doc acima). */
window.NV = window.NV || {};

NV.Classes = (function () {
  const LIST = [
    {
      id: 'breo', name: 'Breo', role: 'Viandante', flame: '#FFB53C',
      img: 'art/png/personagem-breo.png',
      phrase: 'Corajoso mas prudente — olha duas vezes antes de saltar.',
      passiveName: 'Passo Firme',
      passiveDesc: 'Não sofre recuo de golpes leves; ganha Sévia extra ao derrotar inimigos por perto.',
    },
    {
      id: 'silice', name: 'Sílice', role: 'Batedora', flame: '#4FE3FF',
      img: 'art/png/personagem-silice.png',
      phrase: 'Rápida, curiosa, impaciente — fala pouco, aponta muito.',
      passiveName: 'Faro de Brasa',
      passiveDesc: 'A bússola indica quando há um segredo não encontrado na sala atual.',
    },
    {
      id: 'brasme', name: 'Brasme', role: 'Vigia', flame: '#FF5A3C',
      img: 'art/png/personagem-brasme.png',
      phrase: 'Taciturno, leal até a teimosia — mede o perigo pela distância.',
      passiveName: 'Cera Endurecida',
      passiveDesc: 'Reduz dano vindo de frente; ao perder um Coração de Cera, empurra inimigos próximos.',
    },
    {
      id: 'vespera', name: 'Véspera', role: 'Ritualista', flame: '#FF4FC3',
      img: 'art/png/personagem-vespera.png',
      phrase: 'Serena, enigmática, teatral — move-se como procissão.',
      passiveName: 'Memória Acesa',
      passiveDesc: 'Ao morrer, deixa um eco de chama no local — voltar lá em 60s rende Fagulhas de bônus.',
    },
    {
      id: 'turfo', name: 'Turfo', role: 'Coletor', flame: '#B6F13C',
      img: 'art/png/personagem-turfo.png',
      phrase: 'Desconfiado, prático, resmungão afetuoso — conta recursos duas vezes.',
      passiveName: 'Olho de Mercador',
      passiveDesc: 'Inimigos têm chance extra de dropar Sévia em dobro.',
    },
    {
      id: 'parafino', name: 'Parafino', role: 'Funileiro', flame: '#2FA8C9',
      img: 'art/png/personagem-parafino.png',
      phrase: 'Curioso e tagarela mexendo em algo — explica tudo sem ninguém pedir.',
      passiveName: 'Manutenção',
      passiveDesc: 'Golpes acertados recuperam Fulgor extra e soltam fagulhas de cobre.',
    },
  ];
  const BY_ID = {};
  LIST.forEach((c) => { BY_ID[c.id] = c; });
  const DEFAULT_ID = LIST[0].id;

  return {
    list: LIST,
    get(id) { return BY_ID[id] || BY_ID[DEFAULT_ID]; },
    DEFAULT_ID,
  };
})();

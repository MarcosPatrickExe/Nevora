# Registro de Decisões (ADR — Architecture/Any Decision Records)

> Toda decisão relevante do projeto vira uma entrada aqui: contexto,
> alternativas, decisão e consequências. Decisões são imutáveis — para mudar,
> cria-se nova entrada que substitui a anterior.

Formato:

```
## ADR-XXX — Título
- Data: AAAA-MM-DD · Status: proposta | aceita | substituída por ADR-YYY
- Contexto: por que a decisão é necessária
- Alternativas: o que foi considerado
- Decisão: o que foi escolhido e por quê
- Consequências: o que isso implica (bom e ruim)
```

---

## ADR-001 — O jogo será um metroidvania 2D co-op, web-first com PWA
- Data: 2026-07-20 · Status: **aceita** (definição do Diretor)
- Contexto: fãs de HK/Silksong não têm como jogar o gênero em co-op; queremos
  ocupar esse espaço com IP original, lançando primeiro em navegador/PWA e
  depois Steam/Epic/Play Store/App Store.
- Decisão: metroidvania 2D de ação, 1–4 jogadores co-op, IP original,
  planejamento completo antes de codar.
- Consequências: multiplayer influencia TODAS as decisões técnicas e de
  design desde o dia zero; documentação é o produto da Fase 0.

## ADR-002 — Stack técnica (TypeScript + PixiJS + sim própria + Colyseus)
- Data: 2026-07-21 · Status: **aceita** (condicionada ao gate da Fase 1)
- Contexto: Diretor questionou Godot (linguagem própria: **GDScript**; também
  suporta C#). Avaliação registrada em `06-tecnologia/FRAMEWORKS.md`: descartado
  para este projeto por (a) export web pesado e com restrições
  (SharedArrayBuffer/COOP+COEP, iOS instável) — ruim para web-first + PWA
  offline; (b) a simulação não rodaria em Node — o servidor co-op precisaria de
  instâncias headless da engine, mais caras e complexas; (c) predição/rollback
  custom na web é caminho pouco batido em Godot.
- Decisão: TypeScript em todo o projeto; PixiJS (render), física própria,
  Colyseus (salas). Godot fica como plano B formal se o gate da Fase 1 falhar.

## ADR-003 — Repositório novo e dedicado para o jogo (fora do ptk_plays)
- Data: — · Status: **proposta** (Diretor criará o repo; docs serão migradas)

## ADR-004 — Nome do jogo e do mundo: **Névora**
- Data: 2026-07-21 (complementada em 2026-07-22) · Status: **aceita** (decisão do Diretor)
- Complemento do Diretor: **Névora também é o nome do mundo** que guarda todos
  os mapas — jogo e mundo compartilham o nome (como Fiarlongo/Pharloom guarda
  os mapas de Silksong). O nome provisório do mundo, "Alvéola", foi aposentado.
- Consequências: pesquisa de marca (INPI + global) antes do anúncio público;
  domínios e handles sociais a garantir. Codinome "Enxame" aposentado.

## ADR-005 — Jogadores: construir para 2, arquitetura pronta para 4
- Data: 2026-07-21 · Status: **aceita** (decisão do Diretor)
- Regra literal do Diretor: *"O desenvolvimento deve ser construído
  inicialmente para dois jogadores, mas a arquitetura, os identificadores, a
  interface e os protocolos devem nascer preparados para quatro. Isso evita
  reescrever o multiplayer depois."*
- Consequências: todo ID/protocolo/estrutura de estado dimensionado para 4
  slots desde o dia 1 (player index 0–3, HUD com layout p/ 4, salas de 4);
  conteúdo, balanceamento e playtests priorizam 2 até a Fase 4.

## ADR-006 — Câmera co-op parametrizável (independente ⇄ elástica)
- Data: 2026-07-21 · Status: **aceita** (decisão do Diretor)
- Decisão: o estilo de câmera é um **parâmetro da sessão**, alternável entre
  "independente" (cada cliente vê sua área) e "elástica" (tela compartilhada
  com zoom dinâmico). Defaults sugeridos: online = independente, co-op local =
  elástica. Level design obrigado a funcionar nos dois modos.
- Consequências: simulação por "área ativa" precisa suportar ambos; teleport
  suave de reagrupamento no modo elástico; QA testa os dois modos.

## ADR-007 — Escopo de mundo: **18 regiões + hub** (mapa grande, escala Silksong)
- Data: 2026-07-21 · Status: **aceita** (decisão do Diretor)
- Decisão: 18 regiões em 3 portes (8 G / 7 M / 3 P, ~450 salas), ver
  `03-mundo/BIOMAS.md`.
- Consequências: produção de conteúdo é o maior custo do projeto (Fase 4
  longa); mitigação via portes, pipeline data-driven e agentes paralelos.
  Lançamento em "Atos" gratuitos permanece como **plano de contingência**
  (não é o plano padrão), registrado no ROADMAP.

## ADR-008 — Sistema de design de personagem + renomeação da arma inicial
- Data: 2026-07-22 · Status: **aceita** (diretriz detalhada do Diretor)
- Contexto: era preciso transformar a descrição visual de Névora num
  **sistema de design consistente** (não personagens desenhados como ideias
  isoladas), com regra central, linguagem de formas por grupo e materiais
  predominantes definidos.
- Decisão: criada a pasta `docs/art/` com três documentos —
  `CHARACTER_ART_BIBLE.md` (sistema geral), `PLAYER_CHARACTER_DESIGN.md`
  (Acendedores) e `NPC_AND_BOSS_DESIGN.md` (elenco e chefes). A arma inicial
  "Ferrão de Cera" é renomeada para **Atiçador** (utensílio de acender
  pavios, não uma agulha/prego) em toda a documentação.
- Consequências: `07-arte-audio/DIRECAO_DE_ARTE.md` passa a ceder a `art/`
  em qualquer detalhe de personagem; toda arte futura de personagem é
  validada pelo teste de silhueta e pela linguagem de formas do grupo antes
  de aprovação.

## ADR-009 — Geração de imagens: conector MCP Canva para arte de menu/UI
- Data: 2026-07-22 · Status: **aceita** (decisão do Diretor)
- Contexto: avaliados os conectores MCP Adobe for Creativity e Canva para
  gerar concept art. Descoberta: nenhum dos dois é um gerador livre de
  texto-para-imagem — Adobe só organiza/edita assets já existentes; Canva
  `generate-design` compõe designs a partir de templates (funciona bem para
  wallpaper/pôster, não para concept art de criatura/cenário livre).
- Decisão: usar o conector Canva para artes de **menu principal e telas de
  UI** (onde a composição tipo wallpaper/pôster funciona). Personagens e
  cenários continuam sendo gerados externamente pelo Diretor (ex.:
  Midjourney) usando os prompts derivados de `art/` e `03-mundo/BIOMAS.md`,
  trazidos de volta para comparação com a documentação.
- Consequências: dois fluxos de produção de arte distintos e documentados;
  revisitar se um conector de geração livre for adicionado no futuro.

## ADR-010 — Estilo visual: desenhado à mão e digitalizado (processo tipo Cuphead)
- Data: 2026-07-22 · Status: **aceita** (decisão do Diretor)
- Contexto: era preciso fechar o estilo de produção de arte (rig 2D × pixel
  art × frame a frame). O Diretor definiu: personagens, inimigos, cenários e
  demais elementos devem parecer **desenhados à mão e depois digitalizados**,
  como o fluxo de produção de Cuphead (referência de PROCESSO e acabamento —
  nunca de conteúdo, personagens ou época/tema 1930s).
- Decisão: arte final com traço de tinta visível, imperfeições de mão,
  "line boil" (fervilhar de linha) nas animações e fundos com textura de
  pintura sobre papel. O look de Névora continua sendo "Cera e Penumbra" —
  apenas o acabamento é artesanal/digitalizado.
- Consequências: (a) animação frame a frame é o item mais caro do projeto —
  mitigação a validar na Fase 2: híbrido com personagens principais frame a
  frame e elementos secundários em rig disfarçado com line boil; (b) todos os
  prompts de geração (`art/IMAGE_PROMPTS.md`) ganham um bloco de estilo
  obrigatório; (c) o protótipo web usa placeholders procedurais com line boil
  para já ensaiar o feeling do traço.

## ADR-011 — Protótipo web Fase 1 (pasta `prototype/`)
- Data: 2026-07-22 · Status: **aceita** (pedido do Diretor)
- Decisão: iniciar o protótipo jogável web ANTES do fim da Fase 0 para
  validar cedo: menu inicial, movimentação, combate, comportamento de
  inimigos, 5 regiões interligadas (Vale das Velas, Bosque Murmurante,
  Galerias Fúngicas, Vidraçal e Picos Uivantes) com 1 inimigo típico cada.
- Regras: código-fonte em **`prototype/`** (mesmo nível de `docs/` — as
  regras do jogo continuam morando em `docs/`); controles touch na tela
  quando o dispositivo é touch/PWA instalado; no desktop com teclado, tela
  de mapeamento de teclas em vez de botões visíveis; suporte a PWA.
- Consequências: o protótipo é **greybox descartável** (arte placeholder
  procedural) — valida feel e estrutura, não substitui a stack definitiva da
  Fase 1 (ADR-002) nem a arte final (ADR-010).

## ADR-012 — Multiplayer do protótipo: Colyseus/WebSocket agora; robustez de produção fica para antes do lançamento Steam
- Data: 2026-07-24 · Status: **aceita** (decisão do Diretor)
- Contexto: discussão sobre como sincronizar ações entre jogadores (ex.:
  pulo) em tempo real (ver `09-roadmap/BACKLOG_PROTOTIPO.md`, item 7).
  Prós/contras de WebSocket levantados; Colyseus já é a escolha da stack
  final (ADR-002) e usa WebSocket por padrão.
- Decisão: **usar Colyseus (WebSocket) já no protótipo de rede.** O Diretor
  vai testar com amigos que moram na mesma cidade — latência baixa por
  natureza, então WebSocket puro é suficiente para essa fase e o trabalho
  não é descartável (reaproveita direto na stack final).
- ⚠️ **Nota registrada para não esquecer (palavra do Diretor):** o padrão de
  rede validado nos testes com amigos (mesma cidade, baixa latência) **não é
  suficiente para o lançamento na Steam**, onde jogadores estarão
  espalhados geograficamente e a robustez precisa ser bem maior. Antes do
  lançamento, revisitar com testes de latência real e considerar:
  - **Steam Datagram Relay (SDR)**, via Steamworks Networking Sockets —
    tecnologia gratuita da própria Valve para jogos na Steam: roteia o
    tráfego pela rede de relés global da Valve, otimiza a rota entre
    jogadores automaticamente, resolve NAT traversal sem servidor STUN/TURN
    próprio, e nunca expõe o IP dos jogadores. É o caminho mais natural para
    "multiplayer robusto" especificamente por já estarmos mirando Steam —
    forte candidato a substituir/complementar Colyseus no build de loja.
  - Servidores de sala **por região** (SA/NA/EU — já previsto em
    `05-multiplayer/NETCODE.md`), para reduzir a distância física.
  - Reavaliar WebRTC DataChannel (não confiável/não ordenado) para o
    tráfego de posição de alta frequência, conforme já discutido no ADR e
    no NETCODE.md.
  - Infra com autoscaling e monitoramento (custo por sala, sala morta ociosa
    etc.) — mencionado em `08-publicacao/PUBLICACAO.md`.
- Consequências: **duas fases de rede reconhecidas explicitamente** —
  (1) validação com amigos (agora, Colyseus/WebSocket, baixa exigência de
  robustez) e (2) produção Steam (antes do lançamento, decisão própria com
  testes de latência real e provável adoção de SDR). Não confundir uma com
  a outra: passar nos testes com amigos não significa estar pronto pra
  Steam.

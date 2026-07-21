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

## ADR-004 — Nome do jogo: **Névora**
- Data: 2026-07-21 · Status: **aceita** (decisão do Diretor)
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

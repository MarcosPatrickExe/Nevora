# 📚 Documentação do Projeto — **NÉVORA**

> Metroidvania 2D cooperativo, com identidade visual e narrativa 100% originais.
> Plataforma inicial: **Web + PWA**. Futuro: Steam, Epic Games, Play Store, App Store.

**Status geral do projeto:** 🟡 Fase 0 — Pré-produção / Planejamento (nada de código ainda).

---

## O Pitch (1 parágrafo)

Um metroidvania 2D de ação e exploração onde **1 a 4 jogadores** encarnam os
**Acendedores** — pequenos guardiões de cera viva com uma chama no peito — e
atravessam um mundo de insetos corrompidos por um fungo cinzento para reacender
os grandes faróis que mantinham a escuridão afastada. Combate rápido e preciso,
mapa interconectado com biomas e climas radicalmente diferentes, chefes
memoráveis e, principalmente: **tudo isso jogável com os amigos**, o sonho que
Hollow Knight e Silksong nunca realizaram.

---

## Estrutura da documentação

| Pasta | Conteúdo | Status |
|---|---|---|
| [`00-processo/`](./00-processo/) | Agentes de desenvolvimento, setores, registro de decisões (ADR), glossário | 🟡 proposta |
| [`01-visao/`](./01-visao/) | Visão geral, pilares de design, escopo, referências de jogos | 🟡 proposta |
| [`02-narrativa/`](./02-narrativa/) | Enredo completo (início → fim), lore, personagens, finais | 🟡 proposta |
| [`03-mundo/`](./03-mundo/) | Biomas, climas, estrutura do mapa e interconexões | 🟡 proposta |
| [`04-gameplay/`](./04-gameplay/) | Movimentação, combate, armas, ferramentas, progressão, bosses | 🟡 proposta |
| [`05-multiplayer/`](./05-multiplayer/) | Design cooperativo + arquitetura de rede (netcode) | 🟡 proposta |
| [`06-tecnologia/`](./06-tecnologia/) | Frameworks, arquitetura de software, PWA | 🟡 proposta |
| [`07-arte-audio/`](./07-arte-audio/) | Direção de arte, identidade visual, áudio e trilha | 🟡 proposta |
| [`08-publicacao/`](./08-publicacao/) | Pendências futuras: Steam, Epic, Play Store, App Store, ratings | 🟡 backlog |
| [`09-roadmap/`](./09-roadmap/) | Fases do projeto, da pré-produção ao lançamento | 🟡 proposta |
| [`art/`](./art/) | Sistema de design de personagem: bíblia geral, Acendedores, NPCs/chefes | 🟢 aprovado |

### Legenda de status usada nos documentos

- 🟡 **Proposta** — sugestão inicial, aberta para discussão.
- 🔵 **Em discussão** — sendo debatida ativamente.
- 🟢 **Aprovada** — decisão tomada, registrada em `00-processo/DECISOES.md`.
- 🔴 **Rejeitada/Substituída** — mantida apenas como histórico.

---

## Regras de ouro do projeto

1. **IP 100% original.** Referências inspiram mecânica e qualidade — nunca
   conteúdo. Ver [`01-visao/GAME_REFERENCES.md`](./01-visao/GAME_REFERENCES.md).
2. **Multiplayer não é um extra — é o pilar central.** Toda mecânica nova deve
   responder: *"como isso funciona com 2–4 jogadores?"*
3. **Game feel em primeiro lugar.** Se a movimentação não estiver deliciosa
   sozinha numa sala vazia, nada mais importa.
4. **Planejar antes de codar.** Nenhuma linha de código de produção antes da
   Fase 0 ser concluída (ver [`09-roadmap/ROADMAP.md`](./09-roadmap/ROADMAP.md)).
5. **Toda decisão relevante vira um registro** em
   [`00-processo/DECISOES.md`](./00-processo/DECISOES.md), com contexto e
   alternativas consideradas.

---

## Decisões já tomadas (resumo — detalhes em `00-processo/DECISOES.md`)

| ADR | Decisão | Status |
|---|---|---|
| 001 | Metroidvania 2D co-op, IP original, web-first + PWA | 🟢 |
| 002 | Stack: TypeScript + PixiJS + sim própria + Colyseus (Godot = plano B) | 🟢 (gate Fase 1) |
| 004 | Nome do jogo: **Névora** | 🟢 |
| 005 | Construído para 2 jogadores; arquitetura/IDs/UI/protocolos prontos p/ 4 | 🟢 |
| 006 | Câmera co-op **parametrizável**: independente ⇄ elástica | 🟢 |
| 007 | Mundo grande: **18 regiões + hub** (~450 salas) | 🟢 |
| 008 | Sistema de design de personagem (`docs/art/`) + arma inicial renomeada para **Atiçador** | 🟢 |
| 009 | Geração de imagens: Canva MCP p/ menu/UI; personagens/cenários seguem externos | 🟢 |
| 010 | Estilo visual: **desenhado à mão e digitalizado** (processo tipo Cuphead) | 🟢 |
| 011 | Protótipo web greybox em `prototype/` (menu, combate, 5 regiões, touch/PWA) | 🟢 |
| 012 | Multiplayer do protótipo: **Colyseus/WebSocket** agora; robustez Steam (SDR) antes do lançamento | 🟢 |
| 013 | Vida continua **Corações de Cera**; nova moeda **Fagulhas** (só de inimigos) compra expansão | 🟢 |
| 014 | **6 classes** de Acendedores, 1 por save; chama identifica **classe** (slot usa outros canais) | 🟢 |

## Decisões em aberto

| # | Decisão | Onde discutir |
|---|---|---|
| 1 | Modelo comercial da versão web (demo grátis × completo pago) | `08-publicacao/PUBLICACAO.md` |
| 2 | Regra de progresso do visitante em co-op ("Expedição") | `05-multiplayer/MULTIPLAYER_DESIGN.md` |
| 3 | Fichas de arte completas de Brasme (Vigia) e Parafino (Funileiro), padrão de 24 itens da Etapa 3 | `art/ACENDEDORES_REDESIGN.md` |
| 4 | Paleta exata das 4 cores de slot do multiplayer (agora separada das 6 cores de classe, ADR-014) | `art/PLAYER_CHARACTER_DESIGN.md` |

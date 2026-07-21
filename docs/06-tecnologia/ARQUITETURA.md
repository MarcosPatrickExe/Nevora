# Arquitetura de Software

> Status: 🟡 Proposta — pressupõe a Opção A de `FRAMEWORKS.md`.

## Decisão de repositório (em aberto ⚠️)

Este planejamento nasceu dentro do repo `ptk_plays` (um app Flutter não
relacionado). **Recomendação:** criar um repositório novo e dedicado para o
jogo (ex.: `nevora` ou `nevora-game`), monorepo. Esta pasta `docs/` será
movida para lá. O Diretor criará o repositório; por enquanto trabalhamos
localmente.

## Monorepo proposto

```
nevora/
├── docs/                  # esta documentação
├── packages/
│   ├── sim/               # ❤️ simulação compartilhada (client + server)
│   │   ├── physics/       # AABB, swept collision, timestep fixo
│   │   ├── ecs/           # componentes e sistemas de jogo
│   │   ├── combat/        # dano, postura, parry, status
│   │   ├── ai/            # comportamentos de inimigos/bosses
│   │   └── content/       # definições data-driven (armas, inimigos, selos)
│   ├── client/            # jogo no navegador
│   │   ├── render/        # PixiJS: sprites, partículas, iluminação, câmera
│   │   ├── audio/         # web audio, música adaptativa
│   │   ├── input/         # teclado, gamepad, touch; buffer/remap
│   │   ├── ui/            # HUD, menus, mapa, i18n
│   │   ├── net/           # predição, interpolação, reconciliação
│   │   └── pwa/           # service worker, manifest, updates
│   ├── server/            # Colyseus: salas, auth leve, saves
│   ├── content-pipeline/  # importers: LDtk, Aseprite, áudio → formatos do jogo
│   └── tools/             # debug overlay, replay viewer, balance sheets
├── apps/
│   ├── web/               # shell de deploy web/PWA
│   └── desktop/           # (futuro) Tauri/Electron p/ Steam
└── .github/workflows/     # CI
```

## Princípios de arquitetura

1. **`sim` é sagrado:** zero dependência de DOM, Pixi ou Colyseus. Roda em
   worker no solo, no servidor no co-op, e nos testes em Node puro.
   Determinista o suficiente para predição e replays.
2. **Data-driven:** inimigos, armas, Selos, salas e bosses definidos em dados
   (JSON/TS declarativo) validados por schema (Zod) — designers e agentes de
   balanceamento mexem em dados, não em engine.
3. **Timestep fixo (60 Hz) + render interpolado** — feel idêntico em 60/120/144 Hz.
4. **Assets pipeline automatizado:** Aseprite → atlas (texture packer) →
   manifests com hash (cache PWA); LDtk → binário de salas; áudio → sprites de
   som. Nada de asset "solto" commitado sem pipeline.
5. **Orçamentos de performance (enforced no CI futuramente):**
   - bundle inicial ≤ 5 MB (primeira sala jogável), resto por streaming;
   - 60 fps em um Android intermediário de 2022 (dispositivo de referência a
     definir);
   - memória ≤ 300 MB em mobile.
6. **Testes:** sim coberta por testes de unidade/replay (input gravado →
   estado esperado); smoke e2e por bioma; testes de rede com latência
   simulada.
7. **Feature flags** para sistemas experimentais (clima global, stealth boss).

## Debug e ferramentas internas (investimento cedo que se paga)

- Overlay de debug (hitboxes, estados, fps, rede) atrás de query param.
- **Sistema de replay** (inputs gravados): reproduz bugs, valida balance,
  vira material de trailer.
- Sala de teste "gym" com todos os inimigos/armas spawnáveis.
- Cheats de dev (teleport, god, dar item) desabilitados em produção.

## Convenções

- TypeScript strict, ESLint + Prettier, conventional commits, PRs pequenos.
- Cada sistema novo entra com: doc curta em `docs/`, testes da sim, e entrada
  no CHANGELOG interno.

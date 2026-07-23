# CLAUDE.md — Guia para sessões de trabalho neste repositório

Este repositório é o **jogo Névora**: um metroidvania 2D cooperativo (1–4
jogadores), IP 100% original, web-first + PWA, com ports futuros para Steam,
Epic, Play Store e App Store.

## Como retomar o contexto (leia nesta ordem)

1. **`docs/00-processo/DIARIO_DE_BORDO.md` → seção "📍 Estado atual" (topo do
   arquivo)** — onde paramos exatamente agora, links do protótipo no ar, e o
   que está bloqueando o próximo passo. **Leia isso antes de qualquer outra
   coisa, antes de agir ou responder ao Diretor.**
2. `docs/09-roadmap/BACKLOG_PROTOTIPO.md` — pedidos de feature já coletados
   e ainda não implementados (o Diretor costuma dar vários pedidos em
   sequência antes de mandar começar a construir — confira se ele já disse
   "pode implementar" antes de sair codando).
3. `docs/README.md` — índice geral, decisões tomadas (ADRs) e pendências.
4. `docs/00-processo/DECISOES.md` — todas as decisões com contexto (ADR-001+).

## Regras de trabalho combinadas com o Diretor (Marcos Patrick)

- **Commits com a identidade do Diretor:** `git config user.name "Marcos
  Patrick" && git config user.email marcospatrick039474@gmail.com` antes de
  commitar. Push direto na `main` deste repositório.
- **Documentar tudo:** cada sessão de trabalho atualiza o
  `DIARIO_DE_BORDO.md` (o que foi feito + próximos passos), e toda decisão
  relevante vira ADR em `DECISOES.md`. As **regras do jogo moram em `docs/`**
  — código nunca contradiz a documentação sem atualizar a doc junto.
- **IP 100% original:** referências (Hollow Knight, Silksong, Ori, Cuphead
  etc.) inspiram mecânica, qualidade e PROCESSO — nunca conteúdo, nomes,
  personagens ou arte. Ver `docs/01-visao/GAME_REFERENCES.md`.
- **Multiplayer é o pilar nº 1:** construído para 2 jogadores, arquitetura/
  IDs/protocolos/HUD nascem prontos para 4 (ADR-005, citação literal lá).
- **Estilo visual:** desenhado à mão e digitalizado, processo tipo Cuphead
  (ADR-010). Prompts de geração em `docs/art/IMAGE_PROMPTS.md` — sempre com
  o bloco de estilo e o negative prompt.
- **Código-fonte separado da documentação:** protótipo em `prototype/`
  (greybox descartável, vanilla JS); a stack definitiva será TypeScript +
  PixiJS + sim compartilhada + Colyseus (ADR-002), em monorepo conforme
  `docs/06-tecnologia/ARQUITETURA.md`.
- **Branch por versão do protótipo, deploy só no merge para `main`** (regra
  do Diretor, 2026-07-23 — detalhada em `docs/09-roadmap/BACKLOG_PROTOTIPO.md`):
  1. Toda leva de mudanças do protótipo começa numa branch nova:
     `prototype/vN-descricao-curta`.
  2. Commits acontecem só nessa branch — o workflow do Pages **não** reage a
     pushes fora de `main`, então nada é publicado ainda.
  3. Só quando o Diretor aprovar, faz o merge dessa branch para `main` — é
     esse merge que dispara o deploy automático no GitHub Pages.
  4. Depois do merge, marcar a versão com uma tag (`git tag proto-vN`).
  - Isso já é o comportamento nativo do workflow atual (`branches: [main]`
    em `.github/workflows/pages.yml`) — não precisa mudar o YAML, só seguir
    a disciplina de branch acima.

## Estrutura do repositório

| Pasta | Conteúdo |
|---|---|
| `docs/` | Toda a especificação e regras do jogo (fonte da verdade) |
| `docs/art/` | Sistema de design de personagens + prompts + assets gerados |
| `prototype/` | Protótipo web jogável (greybox) — deployado no GitHub Pages |
| `.github/workflows/pages.yml` | Deploy automático de `prototype/` no Pages |

## Integrações da conta do Diretor

- **Google Drive** (conta patrickartes1@gmail.com conectada): artes conceituais
  são salvas na pasta "Névora — Arte Conceitual" (link no
  `docs/art/GENERATED_ASSETS.md`).
- **Canva**: gerações ficam na conta Canva do Diretor; ⚠️ o download direto de
  exports (`export-download.canva.com`, `design.canva.ai`) é **bloqueado pela
  política de rede** das sessões — documente os links, não tente contornar.
- **GitHub Pages**: publica `prototype/` — jogo em `/` e galeria de arte em
  `/art/`.

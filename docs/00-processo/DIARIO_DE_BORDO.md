# Diário de Bordo — Névora

> Registro de continuidade entre sessões de trabalho. **Toda sessão termina
> atualizando este arquivo**: o que foi feito, decisões tomadas e próximos
> passos. Uma sessão nova deve começar lendo este documento (ver `CLAUDE.md`
> na raiz).

---

## Sessão 1 — 2026-07-20 a 2026-07-23 (fundação do projeto)

### O que foi feito (em ordem)

1. **Fase 0 completa em `docs/`** (23+ documentos): visão, pilares, escopo,
   enredo completo em 3 atos com 3 finais, personagens, 18 regiões do mundo,
   mapa por camadas, gameplay core, 6 classes de arma, ~12 ferramentas,
   Selos de Cera, sistema de morte "Eco de Cera", 8+6 bosses, design co-op,
   netcode, stack técnica, PWA, arte/áudio, agentes, publicação, roadmap.
2. **Decisões fechadas (ADR-001 a 011)** — destaques:
   - Nome do jogo E do mundo: **Névora** (como Fiarlongo em Silksong).
   - Stack: TypeScript + PixiJS + sim compartilhada + Colyseus (Godot =
     plano B documentado; a linguagem dele é GDScript).
   - Construído para 2 jogadores, arquitetura pronta para 4 (regra literal
     do Diretor no ADR-005).
   - Câmera co-op parametrizável (independente ⇄ elástica).
   - Mundo grande: 18 regiões + hub, portes G/M/P, ~450 salas.
   - Sistema de design de personagem (`docs/art/`) + arma inicial renomeada
     **Atiçador**.
   - Estilo visual: **desenhado à mão e digitalizado** (processo Cuphead).
3. **Protótipo web jogável em `prototype/`** (greybox, vanilla JS):
   menu, 5 regiões interligadas com climas e 1 inimigo cada, combate com
   pogo/dash/parry-menos (sem parry ainda), Fulgor, lampiões, morte/respawn,
   controles touch para PWA/touch e tela de teclas para desktop, PWA
   (manifest + service worker). Testado em Chromium headless sem erros.
4. **Arte conceitual interna** (SVG estilo "à mão" → PNG renderizado):
   line-up dos 4 Acendedores, bestiário dos 5 inimigos do protótipo, cenário
   Vale das Velas, cenário Galerias Fúngicas, fundo de menu, Bolhinha.
   Galeria em `prototype/art/` (vai junto no Pages).
5. **Prompts de geração** em `docs/art/IMAGE_PROMPTS.md` (com bloco de
   estilo à mão + negative prompts anti-cópia).
6. **GitHub Pages**: workflow em `.github/workflows/pages.yml` publica
   `prototype/` automaticamente a cada push na main.
7. **Google Drive**: pasta "Névora — Arte Conceitual" criada no Drive do
   Diretor; SVGs das artes salvos lá (links em `docs/art/GENERATED_ASSETS.md`).

### Fatos operacionais importantes

- Commits neste repo: identidade **Marcos Patrick
  <marcospatrick039474@gmail.com>**, push direto na `main`.
- O repositório antigo `ptk_plays` é OUTRO produto do Diretor — não tocar,
  não mencionar; os commits de planejamento que ficaram lá são só locais.
- Canva: gerações funcionam e ficam na conta do Diretor, mas o **download
  dos exports é bloqueado** pela política de rede (hosts
  `design.canva.ai` e `export-download.canva.com` negados) — por isso a arte
  "própria" é feita em SVG local. Canva aprovado para menu/UI (ADR-009);
  2 fundos de menu do Canva foram aprovados pelo Diretor (links no
  GENERATED_ASSETS.md).
- Adobe MCP: não gera imagem nova, só organiza/edita assets (ADR-009).

### Próximos passos combinados

- [ ] Diretor testa o protótipo no GitHub Pages (PC e celular/PWA) e traz
      feedback de feel (velocidade, pulo, dash, combate).
- [ ] Diretor gera imagens externas (Midjourney etc.) com os prompts de
      `IMAGE_PROMPTS.md` e traz para eu comparar com a documentação.
- [ ] Decisões em aberto: modelo comercial da web (demo grátis × pago) e
      regra de progresso do visitante co-op ("Expedição").
- [ ] Detalhar fichas dos 8 bosses principais (template em BOSSES.md).
- [ ] Fase 1 real: iniciar o projeto TypeScript + PixiJS (monorepo) quando o
      Diretor aprovar o feel do greybox.

---

*(Próximas sessões: adicionar entradas acima desta linha, mais recentes
primeiro, mantendo o formato "O que foi feito / Fatos / Próximos passos".)*

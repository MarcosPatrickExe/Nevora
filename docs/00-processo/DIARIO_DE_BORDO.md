# Diário de Bordo — Névora

> Registro de continuidade entre sessões de trabalho. **Toda sessão termina
> atualizando este arquivo**: o que foi feito, decisões tomadas e próximos
> passos. Uma sessão nova deve começar lendo este documento (ver `CLAUDE.md`
> na raiz) — a seção logo abaixo é o resumo rápido; o histórico completo por
> sessão vem depois.

---

## 📍 Estado atual (leia isto primeiro)

**Fase:** 0 (pré-produção) concluída em `docs/`; protótipo web greybox no ar
e em validação com o Diretor. Nenhum código de produção (stack final)
começou ainda — só o protótipo descartável.

**🕹️ Protótipo jogável:** https://marcospatrickexe.github.io/Nevora/
**🎨 Galeria de arte conceitual:** https://marcospatrickexe.github.io/Nevora/art/
Ambos republicam sozinhos a cada push na branch `main` (ver regra de branch
abaixo).

### ⏸️ Onde paramos exatamente

O Diretor testou o protótipo, aprovou, trouxe uma leva de pedidos novos
(nickname, loja, áreas secretas, mais clima dinâmico, multiplayer) e avisou
explicitamente: **"tenho mais coisas pra dizer, aguarde minhas ordens."**
Tudo foi **documentado como backlog — nada foi implementado em código**.
**A próxima sessão deve aguardar o Diretor completar a lista antes de
começar a construir qualquer coisa nova**, a menos que ele já tenha dado
essa ordem explicitamente numa mensagem mais recente.

📋 **Lista completa de pedidos pendentes:** `docs/09-roadmap/BACKLOG_PROTOTIPO.md`
(nickname/identificação de jogador, loja do Tio Sebo, upgrades, áreas
secretas, mais clima dinâmico, multiplayer/Colyseus, áudio adiado).

### ✅ Bloqueio resolvido — classes e nomenclatura de vida fechados

Um pacote de design (feito pelo Diretor numa **outra sessão/projeto** que
não tinha acesso de escrita a este repo) foi aplicado em 2026-07-24: sistema
de **6 classes de Acendedores** e redesenho visual completo de
Breo/Sílice/Véspera/Turfo (`art/ACENDEDORES_REDESIGN.md`). Isso revelou um
conflito de nome ("Fulgor" usado pra vida no pacote vs. mana na doc em
vigor) e uma pergunta sobre cor de chama por classe × por slot — **ambos
resolvidos pelo Diretor no mesmo dia:**
- **ADR-013 🟢 aceita:** "Fulgor" continua sendo só mana; vida continua
  **Corações de Cera**. Mecânica nova mantida: moeda **Fagulhas** (só de
  inimigos mortos) compra expansão de vida na Loja de Tio Sebo.
- **ADR-014 🟢 aceita:** 6 classes confirmadas. **A chama identifica a
  classe** (não mais o slot do jogador) — a identidade de slot no
  multiplayer passa a usar os outros canais visuais já previstos (borda,
  partículas, ícone de HUD, nome), numa paleta de 4 cores separada das 6
  cores de classe (paleta exata ainda não definida — pendência de arte, não
  bloqueante).

Pendências que sobraram (não bloqueantes): fichas de arte completas de
Brasme (Vigia) e Parafino (Funileiro), e a paleta exata das 4 cores de
slot. Ver `docs/README.md` → "Decisões em aberto".

### Fatos operacionais que uma sessão nova precisa saber

- **Identidade dos commits:** rodar sempre antes de commitar —
  `git config user.name "Marcos Patrick" && git config user.email marcospatrick039474@gmail.com`.
  Push direto na `main` deste repositório.
- **Branch por versão do protótipo:** toda mudança no protótipo nasce numa
  branch `prototype/vN-descricao`; o deploy só acontece quando essa branch é
  mergeada na `main` (o workflow já só reage a `main` — nenhuma mudança de
  YAML necessária, só disciplina). Detalhes em `CLAUDE.md`.
- **`ptk_plays` é OUTRO produto** do Diretor, sem relação com a Névora — não
  tocar, não mencionar.
- **Canva:** gera imagens de verdade, mas o **download dos exports é
  bloqueado** pela política de rede da sessão (`design.canva.ai`,
  `export-download.canva.com`) — por isso a arte conceitual "própria" é
  feita em SVG local (pasta `prototype/art/svg/`) e salva também no Google
  Drive do Diretor. Não tentar contornar o bloqueio.
- **Multiplayer:** decidido usar **Colyseus (WebSocket)** já no protótipo
  (ADR-012) — mas isso só valida testes com amigos na mesma cidade (baixa
  latência). **Não é suficiente para o lançamento na Steam** — antes de
  lançar, revisitar com testes de latência real; candidato forte: **Steam
  Datagram Relay (SDR)** via Steamworks Networking Sockets. Detalhes em
  `05-multiplayer/NETCODE.md` e `08-publicacao/PUBLICACAO.md`.

### Decisões em aberto (sem resposta ainda)
- Modelo comercial da versão web (demo grátis × pago).
- Regra de progresso do visitante em co-op ("Expedição").
- Fichas detalhadas dos 8 bosses principais (template pronto em `BOSSES.md`).

---

## Sessão 3 — 2026-07-24 (importação de pacote de design: classes + redesenho visual)

O Diretor trabalhou em **outro projeto/sessão** (sem acesso de escrita a
este repo) e preparou um pacote de documentação (zip) para ser aplicado
aqui. Conteúdo aplicado nesta sessão:

- **`docs/04-gameplay/CLASSES_ACENDEDORES.md`** (novo): sistema de 6 classes
  jogáveis — Viandante, Batedora, Vigia, Ritualista, Coletor, Funileiro —
  1 por save, cada uma com passiva + 2 ativas + 1 técnica exclusiva + item
  de mão esquerda fixo. Armas continuam universais (ADR-008). Vira
  **ADR-014** (🟡 proposta).
- **`docs/art/ACENDEDORES_REDESIGN.md`** (novo): fichas de arte completas
  (24 itens cada, padrão "Etapa 3") de Breo (Âmbar), Sílice (Ciano), Véspera
  (Magenta) e Turfo (Verde-lima) — silhueta, materiais, paleta, poses,
  expressões, camadas de sprite e prompts de concept art/sprite/animação.
- **Dois personagens novos anunciados, fichas de arte ainda pendentes**:
  Brasme (Vigia, chama vermelho-brasa) e Parafino (Funileiro, chama
  azul-petróleo) — próximo passo natural sugerido pelo próprio pacote.
- **Renumeração de ADR:** o pacote propunha "ADR 012" e "ADR 013", mas
  ADR-012 já estava em uso neste repo (decisão de multiplayer/Colyseus da
  Sessão 2). Renumerado para **ADR-013** (Fulgores como vida — 🟡 bloqueada
  por conflito de nome) e **ADR-014** (6 classes — 🟡 proposta). Referências
  internas dos dois arquivos novos corrigidas para a numeração certa.
- **⚠️ Conflito de nome identificado e sinalizado (não resolvido, não
  implementado):** o pacote define "Fulgor" = vida (5 unidades discretas,
  expansíveis com a moeda nova "Fagulhas"). A documentação já em vigor usa
  "Fulgor" = recurso de mana (gasto em cura/Artes). A HUD do protótipo v1
  tem os dois elementos separados (corações = vida, medidor "FULGOR" =
  mana) — o pacote parece ter confundido os dois ao trabalhar só a partir
  de uma captura de tela, sem o contexto completo da documentação. Aviso
  detalhado com 3 opções de resolução em `DECISOES.md` (ADR-013). **Nenhum
  código foi alterado** — só documentação, com o conflito bem sinalizado em
  `DECISOES.md`, `GLOSSARIO.md`, `README.md` e nos dois arquivos novos.
- **Outro ponto sinalizado (não resolvido):** a cor de chama por classe (6
  cores, incluindo 2 novas) pode colidir com a cor de chama por *slot* de
  jogador do multiplayer (ADR-005, 4 cores fixas Âmbar/Ciano/Magenta/
  Verde-lima). Precisa decidir se a chama identifica classe ou slot — os
  dois ao mesmo tempo não funcionam com só 4 cores de slot fixas e 6 de
  classe. Detalhado em `DECISOES.md` (ADR-014).

**Estado ao final:** documentação consolidada e publicada; três pendências
de decisão do Diretor adicionadas à tabela "Decisões em aberto" do
`docs/README.md` (nome de Fulgor, cores de chama × slot, fichas de Brasme e
Parafino). Nada implementado em código.

### Continuação — resolução das pendências (mesmo dia)

O Diretor respondeu às 3 pendências:

1. **Aprovou a renumeração de ADR** que eu já tinha feito automaticamente
   (012/013 do pacote → 013/014 deste repo).
2. **"Fulgor" continua mana; vida continua Corações de Cera"** — resolve
   ADR-013 como 🟢 aceita (opção 3 das alternativas levantadas: descartar a
   troca de nome, manter só a mecânica nova de compra de vida com a moeda
   **Fagulhas**, exclusiva de inimigos mortos).
3. **"6 classes confirmadas; cada chama identifica a classe"** — resolve
   ADR-014 como 🟢 aceita. Consequência direta: a identidade de *slot* do
   jogador no multiplayer não pode mais usar a cor da chama (agora ligada à
   classe) — passa a usar os outros canais visuais já exigidos por
   `art/PLAYER_CHARACTER_DESIGN.md` (borda, partículas, ícone de HUD, nome),
   com uma paleta de 4 cores de slot separada das 6 cores de classe.

**Trabalho de consistência feito:** corrigidas todas as menções a "Fulgor"
no sentido de vida nos dois arquivos novos (`CLASSES_ACENDEDORES.md`,
`ACENDEDORES_REDESIGN.md`) para "Coração de Cera" / "Fragmento de Coração";
reescritos os ADR-013 e ADR-014 em `DECISOES.md` como 🟢 aceitos com o
texto final; `art/PLAYER_CHARACTER_DESIGN.md` atualizado (seção "Os quatro
Acendedores" redirecionada para o sistema de 6 classes; regra de
multiplayer reescrita: chama = classe, slot = outros canais);
`00-processo/GLOSSARIO.md` atualizado (Fulgor sem aviso de conflito,
entradas novas para Corações de Cera, Fragmento de Coração, Fagulhas,
Classes de Acendedor); `04-gameplay/PROGRESSAO.md` (Loja de Tio Sebo)
integra a moeda Fagulhas à compra de Fragmentos de Coração;
`docs/README.md` com as tabelas atualizadas (ADR-013/014 em 🟢; pendências
restantes: fichas de Brasme/Parafino e paleta exata das 4 cores de slot).

**Nada implementado em código** — só documentação, agora sem conflitos
internos conhecidos.

---

## Sessão 2 — 2026-07-23/24 (feedback do protótipo + backlog + multiplayer)

Diretor testou o protótipo publicado no GitHub Pages e aprovou o resultado
("para um protótipo simples isso está ficando incrível"). Trouxe uma leva de
ideias novas — **registradas como backlog, nada implementado em código**:

- Ver **`docs/09-roadmap/BACKLOG_PROTOTIPO.md`**: tela de
  nickname/identificação de jogador para testes com amigos (+ discussão
  sobre limitação de site estático sem backend — proposta de rota simples
  agora vs. backend leve no futuro), loja do Tio Sebo com vitrine cara desde
  cedo, Fragmentos de Coração como item mais caro, Artes com cargas
  limitadas, áreas secretas com itens exclusivos, mais clima dinâmico em
  todas as regiões (elogiou a neve/vento dos Picos Uivantes), áudio
  confirmado como adiado, e comunicação multiplayer em tempo real.
- **Decisão de processo 🟢:** branch por versão do protótipo, deploy só no
  merge para `main` (já nativo do workflow, só formalizamos a disciplina).
  Documentado em `CLAUDE.md` e `BACKLOG_PROTOTIPO.md`.
- **Docs de design refinados:** `04-gameplay/PROGRESSAO.md` ganhou a seção
  "A Loja de Tio Sebo" (filosofia de preços); `03-mundo/MAPA.md` explica por
  que o save point é um **Lampião** (bronze + vidro) e não uma fogueira —
  não derrete o Acendedor, ecoa o tema de "reacender faróis" em escala
  pessoal.
- **Multiplayer (ADR-012):** discussão de prós/contras de WebSocket para
  sincronizar ações (ex. pulo) entre até 4 jogadores. **Decisão do
  Diretor:** usar Colyseus (WebSocket) já no protótipo — testes serão com
  amigos da mesma cidade, latência baixa, trabalho reaproveitável na stack
  final (ADR-002). **Ressalva registrada a pedido explícito do Diretor:**
  isso não prova robustez para a Steam (jogadores espalhados
  geograficamente) — candidato documentado para essa fase futura: **Steam
  Datagram Relay (SDR)**, tecnologia gratuita da Valve via Steamworks
  Networking Sockets. Detalhes em `05-multiplayer/NETCODE.md` e
  `08-publicacao/PUBLICACAO.md`.

**Estado ao final da sessão:** só documentação atualizada, zero código novo
no protótipo. Aguardando o Diretor terminar de listar os pedidos antes de
começar a implementar qualquer item do backlog.

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
   pogo/dash, Fulgor, lampiões, morte/respawn, controles touch para PWA e
   tela de teclas para desktop, PWA (manifest + service worker). Testado em
   Chromium headless sem erros.
4. **Arte conceitual interna** (SVG estilo "à mão" → PNG renderizado):
   line-up dos 4 Acendedores, bestiário dos 5 inimigos do protótipo, cenário
   Vale das Velas, cenário Galerias Fúngicas, fundo de menu, Bolhinha.
   Galeria em `prototype/art/` (vai junto no Pages).
5. **Prompts de geração** em `docs/art/IMAGE_PROMPTS.md` (com bloco de
   estilo à mão + negative prompts anti-cópia).
6. **GitHub Pages**: workflow em `.github/workflows/pages.yml` publica
   `prototype/` automaticamente a cada push na main. Ativado manualmente
   pelo Diretor (Settings → Pages → Source: GitHub Actions).
7. **Google Drive**: pasta "Névora — Arte Conceitual" criada no Drive do
   Diretor; SVGs das artes salvos lá (links em `docs/art/GENERATED_ASSETS.md`).

### Próximos passos combinados (status ao fim da Sessão 1)

- [x] GitHub Pages ativado e no ar.
- [ ] Diretor testa o protótipo e traz feedback de feel — **feito na Sessão 2**.
- [ ] Diretor gera imagens externas (Midjourney etc.) com os prompts de
      `IMAGE_PROMPTS.md` e traz para comparar com a documentação.
- [ ] Decisões em aberto: modelo comercial da web, regra de progresso do
      visitante co-op ("Expedição").
- [ ] Detalhar fichas dos 8 bosses principais.
- [ ] Fase 1 real: iniciar o projeto TypeScript + PixiJS (monorepo) quando o
      Diretor aprovar o feel do greybox.

---

*(Próximas sessões: adicionar entradas acima desta linha — logo abaixo do
"Estado atual", que deve ser sempre reescrito para refletir a realidade mais
recente — mantendo o formato "O que foi feito / Fatos / Próximos passos".)*

# Diário de Bordo — Névora

> Registro de continuidade entre sessões de trabalho. **Toda sessão termina
> atualizando este arquivo**: o que foi feito, decisões tomadas e próximos
> passos. Uma sessão nova deve começar lendo este documento (ver `CLAUDE.md`
> na raiz) — a seção logo abaixo é o resumo rápido; o histórico completo por
> sessão vem depois.

---

## 📍 Estado atual (leia isto primeiro)

**Fase:** 0 (pré-produção) concluída em `docs/`; protótipo web greybox no ar
e em validação ativa com o Diretor (várias rodadas de feedback jogando de
verdade, inclusive no celular). Nenhum código de produção (stack final)
começou ainda — só o protótipo descartável.

**🕹️ Protótipo jogável:** https://marcospatrickexe.github.io/Nevora/
**🎨 Galeria de arte conceitual:** https://marcospatrickexe.github.io/Nevora/art/
Ambos republicam sozinhos a cada push na branch `main` (ver regra de branch
abaixo). **O deploy automático está confirmado funcionando de verdade** —
inclusive o cache do PWA, que já causou confusão duas vezes (ver ADR-019).

### ⏸️ Onde paramos exatamente (atualizado 2026-08-01)

**v3.3 está mergeada em `main` e no ar**, com tudo testado antes do merge:
mapa estilo Silksong (contorno real do terreno por região), tela de
Configurações (volume + editor de botões touch), correção do bug de grafo
(voltar pelo mesmo caminho levava a região errada), 3 perigos ambientais
(lava no Vidraçal, água pútrida com verme em Galerias, água gelada +
blocos de gelo em Picos — ADR-017) e o **sistema de 6 classes jogáveis**
(tela de escolha permanente por save, cor de chama por classe, passiva de
cada uma funcionando de verdade — ADR-018). Detalhe sessão a sessão nas
entradas "Sessão 7/8/9" logo abaixo; changelog técnico completo em
`prototype/README.md` (seções "Novidades da v3.1/v3.2/v3.3").

**Incidente pós-merge, já resolvido:** depois do merge da v3.3 o Diretor
reportou (com screenshot) que o jogo publicado "não atualizava". Não era
falha de deploy — o GitHub Actions confirmava sucesso a cada push — era o
service worker do PWA preso servindo um cache antigo (`CACHE` em
`prototype/sw.js` nunca tinha subido de número desde antes da v3.1).
Corrigido de forma estrutural, não só o sintoma: cache-busting agora é
**automático** (SHA do commit estampado pelo workflow a cada deploy) e o
`fetch()` virou "rede primeiro, cache como reserva" — ver ADR-019. Esse
tipo de incidente não deve mais acontecer em releases futuras.

**Próxima ação:** aguardando o Diretor jogar a v3.3 (já com o hotfix de
cache aplicado) e trazer feedback. Pendências abertas conhecidas — ver
tabela "Decisões em aberto" em `docs/README.md`:
1. Próximas áreas do mapa além das 8 atuais, inspiradas na diversidade de
   bioma/paleta do mapa-múndi de referência do Silksong que o Diretor
   mandou (`docs/referencias/mapas/`) — regra de paleta-por-região já
   documentada em `CLAUDE.md`, esperando ordem pra desenhar as áreas novas.
2. As 2 habilidades ativas + a técnica exclusiva de cada uma das 6 classes
   (a passiva já está implementada — ADR-018).
3. Revisão do Diretor: 8 fichas de boss (`docs/04-gameplay/bosses/`) e os
   6 retratos de personagem (`prototype/art/png/personagem-*.png`) —
   pendência antiga, ainda em aberto.
4. Upload dos 6 retratos de personagem para o Google Drive do Diretor —
   ver nota operacional abaixo (ainda não resolvido, causa diferente da
   registrada em 2026-07-24).

📋 **Lista completa de pedidos do backlog:** `docs/09-roadmap/BACKLOG_PROTOTIPO.md`.

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

Pendência que sobrou (não bloqueante): a paleta exata das 4 cores de slot.
Ver `docs/README.md` → "Decisões em aberto". As fichas de arte de Brasme e
Parafino **foram concluídas em seguida, no mesmo dia** — ver Sessão 3
abaixo.

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
- **Cache-busting do PWA é automático desde 2026-08-01 (ADR-019):** nunca
  mais precisa editar manualmente `CACHE` em `prototype/sw.js` — o workflow
  já estampa o SHA do commit sozinho a cada deploy. Se algum dia
  `prototype/sw.js` ou `.github/workflows/pages.yml` forem reescritos do
  zero, preservar esse mecanismo (senão o incidente de "versão antiga"
  volta a acontecer).
- **Google Drive nas sessões de Claude Code Remote (CCR):** confirmado em
  2026-07-31 que o conector Google Drive aparece **autorizado na conta**
  do Diretor (`ListConnectors` retorna `connected: true`), mas **não fica
  habilitado por padrão nas sessões de chat CCR** (`enabledInChat: false`)
  — nenhuma ferramenta de Drive fica disponível nessas sessões, mesmo sem
  erro de conexão. Diferente do incidente de 2026-07-24 (conector caiu no
  meio da sessão): aqui ele nunca chega a ligar. Enquanto isso não mudar,
  assets novos (ex.: a imagem de referência do mapa de Silksong) ficam
  salvos dentro do próprio repositório (`docs/referencias/`), no mesmo
  espírito de `docs/art/`.

### Decisões em aberto (sem resposta ainda)
- Modelo comercial da versão web (demo grátis × pago).
- Revisão do Diretor: 8 fichas de boss (`docs/04-gameplay/bosses/`) e os 6
  retratos de personagem gerados (`prototype/art/png/personagem-*.png`).
- Duelo de Fase 2 do Pavio-Rei em co-op: sequencial ou simultâneo entre os
  jogadores (nota de playtest em
  `docs/04-gameplay/bosses/08-pavio-rei.md`).
- Upload dos 6 retratos de personagem para o Google Drive do Diretor —
  ver nota operacional acima (Drive não habilitado nas sessões CCR); ainda
  sem solução — precisa ou habilitar o conector nessa sessão, ou o Diretor
  fazer o upload manualmente a partir do repositório.
- Próximas áreas do mapa além das 8 atuais (ver ADR-017 e a referência
  visual em `docs/referencias/mapas/`) — aguardando ordem do Diretor pra
  desenhar.
- As 2 ativas + a técnica exclusiva de cada uma das 6 classes (ADR-018) —
  passiva já implementada, resto fica pra uma fase futura.

### Nota operacional — Google Drive desconectado (2026-07-24, histórico)

Em algum ponto da Sessão 3 o conector `mcp__Google_Drive__*` parou de
responder (funcionava antes, no início da mesma sessão). Os 6 retratos de
personagem foram commitados normalmente no GitHub (`prototype/art/svg/` e
`prototype/art/png/`), mas **não** foram copiados para a pasta "Névora —
Arte Conceitual" do Drive como de costume. Marcado como `⏳ pendente (Drive
offline)` em `docs/art/GENERATED_ASSETS.md` — **segue pendente até hoje**;
ver o fato operacional novo acima (2026-07-31) sobre por que isso continua
sem solução nas sessões CCR.

---

## Sessão 9 — 2026-08-01 (investigação "o jogo não atualizou" + cache-busting automático + checkpoint dos documentos)

Depois do merge da v3.3 (Sessão 8), o Diretor reportou duas vezes seguidas
que a versão publicada "não atualizou" — a primeira com uma foto do menu
mostrando "Protótipo v3" (sem os botões de Mapa/Configurações novos), a
segunda com uma captura da página de deployments do GitHub mostrando o
histórico completo de publicações.

**Investigação:** confirmado via `mcp__github__actions_get`
(`get_workflow_run`) que o deploy da v3.3 (commit `f7a423d`) tinha
`status: completed, conclusion: success` — ou seja, **o deploy funcionou
perfeitamente**. A própria screenshot do Diretor confirmou isso de outro
ângulo: o deploy da v3.3 aparecia como "Active" (run #7) na lista de
`Latest deployments`. O problema não era publicação, era **cache do lado
do cliente**: `prototype/sw.js` é um service worker cache-first cujo
`CACHE` nunca tinha subido de número desde antes da v3.1 — o comentário no
próprio arquivo já alertava exatamente sobre esse risco (fruto de um
incidente anterior, ver Sessão 7). Qualquer PWA já instalado no celular do
Diretor continuava servindo os arquivos daquele cache antigo pra sempre,
não importa quantos deploys novos acontecessem depois.

**Correção em duas etapas** (a pedido do Diretor: "veja uma forma de
prevenir isto nos lançamentos das próximas versões", depois de já ter
mergeado um primeiro hotfix manual):

1. **Hotfix imediato** (branch `prototype/v3.3.1-fix-cache-versao`,
   mergeada): bump manual de `CACHE` (`v3` → `v3.3`) + `NV.VERSION`
   atualizado de "v3" genérico pra "v3.3" no menu + os arquivos novos
   (`classes.js`, `map.js`) adicionados à lista `ASSETS` do precache.
2. **Correção estrutural** (mesma branch, commits seguintes, também
   mergeados) — ADR-019: `CACHE` passou a usar um placeholder
   (`nevora-proto-__BUILD_ID__`) substituído automaticamente pelo **SHA do
   commit** via um passo novo no workflow
   (`.github/workflows/pages.yml`, `sed` antes do
   `upload-pages-artifact`) — elimina de vez a dependência de memória
   humana. Como segunda camada de proteção, o `fetch()` do service worker
   virou "rede primeiro, cache como reserva" (`cache:'no-store'`,
   necessário porque o `fetch()` dentro do service worker também é
   interceptado pelo cache HTTP comum do navegador, não só pelo Cache API)
   — mesmo que o cache-busting automático falhasse por algum motivo, quem
   estiver online recebe a versão mais nova mesmo assim.

Testado via Playwright: simulado um cache antigo pré-existente + registro
do service worker novo, confirmando que o `activate()` limpa o cache velho
e o novo cache busting funciona; simulada uma "mudança no servidor" sem
tocar em `CACHE` nenhum, confirmando que o `fetch()` rede-primeiro traz o
conteúdo novo mesmo assim; testado o fallback offline (continua
funcionando via cache quando não há rede); smoke test completo do boot do
jogo com o service worker novo presente, zero erros de console.

Merge aprovado e deployado com sucesso (`1bdd355`, run #8, confirmado via
API). Registrado como **ADR-019** em `DECISOES.md`.

**Checkpoint dos documentos** (a pedido explícito do Diretor, mesma
sessão): `DIARIO_DE_BORDO.md` (este arquivo — "Estado atual" reescrito,
Sessões 7/8/9 adicionadas), `docs/09-roadmap/BACKLOG_PROTOTIPO.md`
(itens antigos marcados como implementados, pendências novas registradas),
`docs/00-processo/DECISOES.md` (ADR-017/018/019 novas) e `docs/README.md`
(tabela de decisões + decisões em aberto atualizadas) — tudo só no
repositório **Nevora** (`ptk_plays` nunca tocado, conforme regra fixa do
projeto).

**Estado ao final:** v3.3 + hotfix de cache no ar, deploy automático
confirmado funcionando de ponta a ponta (inclusive o cache do PWA).
Documentação de checkpoint atualizada. Aguardando o Diretor confirmar que
a versão nova apareceu no celular dele e trazer o próximo feedback.

---

## Sessão 8 — 2026-07-31 (v3.3: mapa estilo Silksong, Configurações, correção do grafo, perigos ambientais, sistema de 6 classes)

Sessão longa, em duas partes: primeiro um lote de correções de bugs reais
relatados pelo Diretor depois de ver a namorada dele jogar, depois (mesma
branch, antes do merge) um pedido de duas features grandes vindo de uma
screenshot do mapa-múndi de Silksong.

**Parte 1 — bugs relatados jogando de verdade** (branch
`prototype/v3.3-mapa-config-correcoes`):
1. **Visibilidade ruim em Galerias Fúngicas** (área escura): raio de luz
   do halo do jogador aumentado (150→190, até 270 com Fulgor cheio) e
   ganhou um "platô" de visão plena (60% do raio totalmente claro antes de
   esmaecer), em vez de esmaecer desde o centro — dá tempo de reação real
   contra inimigos/espinhos sem perder o clima de escuridão.
2. **Bug real de grafo confirmado e corrigido:** voltar andando por uma
   região com mais de uma entrada possível (ex.: Galerias, alcançável
   tanto pelo Bosque quanto pelo atalho do Sótão) sempre devolvia pro
   vizinho "padrão" da cadeia principal, não pra região de onde o jogador
   realmente veio. Corrigido registrando de verdade a origem de cada
   transição (`g.enteredFrom`/`g.enteredSide` em `js/game.js`) — sem
   precisar reescrever o sistema de portais pra um grafo bidirecional
   completo, só rastrear o histórico da sessão.
3. **X/Y não preservados nas transições** — investigado e confirmado que
   já tinha sido corrigido na v3.2 (`groundBelow`/`airTop` em
   `world.js`); testes de regressão específicos confirmaram que continua
   funcionando depois das mudanças desta sessão.
4. **Tela de Mapa** (toggle — abre/fecha no mesmo botão, tecla `M` ou
   botão touch): reescrita como SVG que traça o **contorno real do
   terreno** de cada região (`js/map.js`, amostra a grade de tiles via
   `NV.World.buildLevel` — função pura, segura de chamar fora do
   gameplay), no espírito do mapa de Hollow Knight/Silksong — nada de
   círculos/retângulos genéricos.
5. **Tela de Configurações** (ícone ⚙, menu e pausa): volume de
   música/efeitos (sliders, `localStorage`) + o que já existia (modo dos
   botões touch, editor de posição/tamanho), tudo centralizado.
6. **Música com variação melódica de verdade:** cada região ganhou uma
   escala musical própria e uma camada de arpejo aleatório sobre o drone
   de sempre (`scheduleMelody` em `js/audio.js`) — antes soava "uma nota
   só".

**Parte 2 — pedido do Diretor com screenshot do mapa de Silksong** (antes
do merge): (a) redesenhar o visual do Mapa pra mostrar o terreno orgânico
de cada região (já coberto pelo item 4 acima, adiantado); (b) "os inimigos
nem sempre devem ser o maior desafio... mas sim o próprio espaço" — lava,
lago verde de vermes, lago gelado. Perguntado sobre escopo via
`AskUserQuestion`, o Diretor respondeu **"encaixar nas regiões
existentes"** e confirmou as 3 mecânicas (ADR-017): lava = morte
instantânea (Vidraçal), água pútrida = dano contínuo + lentidão + inimigo
Verme novo (Galerias), água gelada + blocos de gelo como plataforma móvel
(Picos). Implementado com 3 novos códigos de tile (6/7/8) em
`world.js`/`entities.js`/`render.js`, seguindo o mesmo padrão dos
espinhos/cipó já existentes.

Antes do merge, o Diretor trouxe mais dois pedidos: (c) salvar a imagem de
referência do Silksong organizada em algum lugar (Google Drive não
disponível nesta sessão — ver nota operacional — guardada em
`docs/referencias/mapas/` no repo) e formalizar a regra de paleta por
região no `CLAUDE.md`; (d) **tela de escolha de classe antes do jogo**,
já que os 6 personagens gerados representam 6 classes jogáveis.
Perguntado sobre o nível de profundidade, o Diretor pediu explicitamente
**"quero passiva de cada classe"** — não só visual (ADR-018). Implementado:
`js/classes.js` (dados das 6 classes), tela `#classScreen` com escolha
**permanente por save**, cor de chama refletindo a classe em jogo/HUD, e
as 6 passivas funcionando de verdade (Breo: sem recuo de dano leve +
Sévia bônus por kill próximo · Sílice: pista de segredo no HUD · Brasme:
reduz dano frontal + onda ao perder Coração de Cera · Véspera: eco de
chama pós-morte com bônus de Fagulhas · Turfo: chance de Sévia em dobro ·
Parafino: +1 Fulgor extra por acerto). As 2 ativas + técnica exclusiva de
cada classe ficam pra depois (ADR-018).

**Testado via Playwright em cada etapa** (zero erros de console em todos
os cenários): visibilidade de Galerias, backtracking sótão↔galerias↔bosque
em ambas direções, mapa abrindo/fechando com as 8 formas renderizando sem
exceção, segredos das regiões alteradas continuando coletáveis, os 3
hazards isoladamente (dano/morte/lentidão/carregamento pelo floe), fluxo
completo da tela de classe (nickname→classe→controles→jogo) com
permanência confirmada após reload, e as 6 passivas isoladamente.

**Estado ao final:** branch `prototype/v3.3-mapa-config-correcoes`
mergeada em `main` (commit `f7a423d`) com aprovação explícita do Diretor,
deploy confirmado com sucesso. (O incidente de cache pós-merge e sua
correção estão na Sessão 9, junto com o checkpoint destes documentos.)

---

## Sessão 7 — 2026-07-30 (hotfix de cache antigo + v3.2: pausa touch e posição nas transições)

Dois lotes nesta data. **Primeiro, um hotfix isolado** de service worker
(merge separado, antes da v3.2): os botões touch apareceram bagunçados
numa v3 já publicada — `index.html` novo carregava, mas `style.css`
ficava preso numa versão de cache anterior à existência do D-pad.
Corrigido subindo o número de `CACHE` em `prototype/sw.js` (o comentário
de aviso que motivou toda a investigação da Sessão 9 nasceu aqui). Esse
foi o **primeiro** dos dois incidentes de cache do PWA — o segundo, mais
sério, aconteceu depois da v3.3 e recebeu correção estrutural (ADR-019,
Sessão 9).

**Depois, protótipo v3.2** (branch `prototype/v3.2-pausa-e-transicoes`,
mergeada em `main`): botão de pausa touch (canto superior esquerdo —
antes só dava pra pausar pelo Esc do teclado, sem opção nenhuma no
celular/PWA) e correção de posição nas transições de região — os portais
verticais (brasas, alçapão, cipó) sempre jogavam o jogador no canto
inferior esquerdo da região de destino, ignorando de onde ele veio.
Corrigido: **X preservado proporcionalmente** (cai num ponto a 1/4 da
largura de origem → chega a 1/4 da largura do destino) e **Y livre pra
gravidade** (cai do teto do destino ou emerge do chão, em vez de
teleportar pra uma posição fixa); transições **laterais** também passaram
a preservar a altura Y quando existe chão/plataforma correspondente na
região vizinha (Vale/Bosque/Vidraçal ganharam plataformas extras perto das
bordas pra essa preservação ter efeito de verdade). Detalhe técnico
completo em `prototype/README.md` → "Novidades da v3.2".

**Estado ao final:** hotfix de cache e v3.2 ambos mergeados e publicados
com sucesso.

---

## Sessão 6 — 2026-07-29 (navegação multi-caminho: protótipo vira grafo de 8 regiões)

Continuação direta da Sessão 5, mesmo dia: o Diretor respondeu de uma vez
as 3 perguntas de escopo que ficaram em aberto sobre o pedido de navegação
estilo Silksong — "1- devem levar a regiões diferentes. Implemente mesmo
que demore, eu posso aguardar. 2- sim, o cipó somente para o bosque. O
recurso de traversal único para as outras 4 regiões também pode
implementar! 3-junte todas as implementações na v3. Faça o Merge da v3
somente quando acabar e testar tudo". O Diretor também sugeriu, antes
disso, representar a topologia em texto usando barras/hífens (mesmo
estilo do diagrama de camadas já existente em `03-mundo/MAPA.md`) — adotado
na documentação desta sessão.

**Arquitetura — de corrente linear pra grafo por id:**
- `js/world.js` reescrito: cada região agora tem `id`, `prev`/`next`
  (cadeia principal, mesmo comportamento esquerda/direita de sempre) e
  `portals` (saídas verticais topo/fundo, com faixa de x em tiles e
  região de destino). `buildLevel(id, ...)` troca a busca por índice por
  busca em `LEVELS_BY_ID`. Todas as transições sempre pousam o jogador no
  `entryLeft` padrão do destino — decisão consciente de simplificação
  (várias rotas convergindo no mesmo ponto de entrada é um padrão normal
  de metroidvania, e evita ter que inventar pontos de entrada
  customizados pra cada portal).
- `js/game.js`: a checagem de transição de região agora primeiro varre
  `g.level.portals` (saída vertical, dispara quando o x do jogador está na
  faixa do portal e y passa de um limiar acima/abaixo do mapa) antes de
  cair na checagem padrão de esquerda/direita e no "caiu fora do mapa
  morre e reaparece" — usando uma flag `transitioned` pra não processar os
  três casos na mesma frame. `g.respawn`/`onPlayerDeath`/"fim do
  protótipo" trocaram de índice numérico pra id (`def.final` marca a
  região final em vez de comparar com `count-1`).
- `js/audio.js`: `REGION_TONES` virou objeto por id (com entradas novas
  pras 3 regiões-atalho, cada uma uma variação sutil do tom da região-mãe).
- `js/save.js`: "região mais distante (índice/5)" virou "regiões
  visitadas (Set de ids)/`NV.World.count`" — mais correto pra um grafo
  onde não existe mais uma noção linear de "mais longe".

**3 regiões novas, cada uma com 1 segredo exclusivo:** Sótão do Sineiro
(acima do Vale, via brasas), Adega de Cera (abaixo do Vale, via alçapão no
chão) e Copa do Bosque (acima do Bosque, via cipó) — as duas primeiras
reconectam em Galerias e Vidraçal; a última pula direto pra Picos Uivantes,
ignorando Galerias e Vidraçal por completo se o jogador preferir essa rota.

**3 mecânicas novas de travessia, cada região com a sua (nenhuma repetida
igual):**
1. **Cipó** (`entities.js`, tile código 4, só no Bosque/Copa do Bosque):
   segurar ↑/↓ encostado no cipó sobe/desce sem gravidade a
   `P.CLIMB_SPEED`; pular solta normalmente (o cipó só concede coyote
   time, não trava o input de pulo).
2. **Zona de updraft** (empuxo constante pra cima, substitui a gravidade
   enquanto o jogador está dentro da faixa de x — e opcionalmente de y,
   ver Vidraçal abaixo): usada nas brasas do Vale (leva ao Sótão, sem
   limite de altura — só precisa sair da tela por cima) e no vórtice de
   areia do Vidraçal (com um **limite de altura** — o vórtice desliga
   perto de uma ledge nova, deixando a gravidade assentar o jogador em
   cima dela; sem esse limite o jogador simplesmente subiria pra sempre,
   nunca pousando — bug pego e corrigido durante o teste, ver abaixo).
3. **Cogumelo-mola / bounce pad** (`entities.js`, tile código 5, só em
   Galerias): pisar nele lança o jogador pra cima com um impulso fixo,
   mecânica de impulso instantâneo (diferente do updraft, que é força
   contínua) — usado no caminho principal de Galerias como elemento de
   flavor/atalho, não como gate obrigatório.

Picos Uivantes manteve seu recurso já existente (vento que empurra no ar,
usado pro segredo escondido "atrás do vento") — satisfaz o pedido do
Diretor sem precisar de mecânica nova ali.

**Dois bugs reais pegos e corrigidos durante o teste (nenhum dos dois era
óbvio antes de testar de verdade):**
1. **Vórtice de areia sem limite de altura fazia o jogador nunca pousar na
   ledge do segredo do Vidraçal** — a ledge era um tile sólido comum
   (`#`), então o jogador subindo por baixo esbarrava nela como um teto,
   nunca conseguindo ficar em cima; e mesmo corrigindo isso, um updraft
   sem limite de y faria o jogador subir pra sempre. Corrigido com dois
   ajustes: a ledge virou plataforma vazada (`=`, atravessável de baixo
   pra cima), e a zona de updraft ganhou um limite de altura (`y1`) que
   desliga o empuxo perto da ledge, deixando a inércia residual + a
   gravidade completarem um arco natural até pousar em cima.
2. **`Player.collectSecret` chamava `g.showToast(...)`, que nunca existiu
   no objeto de estado** (só como `NV.Game.showToast`, exposto
   separadamente pelo módulo) — bug **pré-existente**, não introduzido
   nesta sessão: coletar **qualquer segredo do protótipo, em qualquer
   versão já publicada** (v1/v2/v3), lançava uma exceção não tratada e
   quebrava o jogo. Só não tinha sido detectado porque nenhum teste
   automatizado anterior chegava a pisar exatamente em cima de um
   segredo. Corrigido expondo `g.showToast = showToast;` no estado do
   jogo em `js/game.js`.

**Testado via Playwright** (regressão + funcional, tudo com zero erros de
console):
- Cada mecânica nova isoladamente, por manipulação direta de estado
  (determinístico — evita depender de timing de input simulado pra
  platforming preciso): updraft do Vale leva ao Sótão, alçapão leva à
  Adega, cipó do Bosque leva à Copa do Bosque, bounce pad de Galerias
  lança o jogador (~-820 de impulso vertical), vórtice do Vidraçal entrega
  o segredo novo.
- Cadeia principal completa ida e volta (Vale↔Bosque↔Galerias↔Vidraçal↔
  Picos), os 3 links de reconexão das regiões-atalho (Sótão→Galerias,
  Adega→Vidraçal, Copa do Bosque→Picos).
- Os 7 segredos totais (4 novos + 3 já existentes) coletáveis sem erro —
  foi esse teste que revelou o bug do `g.showToast`.
- Conclusão do protótipo (acender o lampião final em Picos) disparando
  `finished`/`NV.Save.noteFinished()` corretamente via `def.final`.
- Resumo de progresso mostrando "Regiões visitadas: X/8" corretamente.
- Regressão completa da UI já entregue: menu → nickname → jogar, andar,
  pulo, ataque via Numpad5, pausa, resumo, D-pad touch (4 ações
  reconhecidas), editor de layout dos botões touch (entrar/sair sem
  erro).
- Inspeção visual (screenshot) das 8 regiões — confirmado visualmente
  cipó, brilho do portal, cogumelo-mola e cada tema/clima renderizando
  corretamente.

**Documentação:** topologia completa registrada em `docs/03-mundo/MAPA.md`
(nova seção "Protótipo web", com o diagrama em barras/hífens sugerido pelo
Diretor) e `docs/09-roadmap/BACKLOG_PROTOTIPO.md` (pendência marcada como
implementada); `prototype/README.md` com seção própria "Navegação
multi-caminho".

**Estado ao final:** tudo implementado, testado e commitado na branch
`prototype/v3-controles-inputs` — pronta pro merge em `main`, que o
Diretor já autorizou fazer assim que tudo estivesse pronto e testado.

---

## Sessão 5 — 2026-07-29 (v3 ainda em teste: versão no menu, D-pad de 4 direções, pedido de navegação multi-caminho)

O Diretor jogou a v2 (a v3 ainda não tinha ido pra `main`) e trouxe dois
pedidos pontuais mais um pedido grande de design de nível, com uma
screenshot mostrando o problema do D-pad no celular (só ◀▶ visíveis).

**Implementado nesta sessão, ainda na branch `prototype/v3-controles-inputs`
(5 commits — um por arquivo, como pedido):**

1. **Número da versão no menu.** `NV.VERSION = 'v3'` centralizado em
   `js/main.js`, exibido na tela inicial ("Protótipo v3") e incluído no
   texto do resumo de progresso (`js/save.js`) — assim o Diretor (e quem
   mais testar) sempre sabe qual build está rodando.
2. **D-pad de 4 direções no touch.** A screenshot mostrou só ◀▶ nos
   controles de celular. Ao investigar, o botão de pular touch **não**
   tinha o bug do W/Espaço (aquele era só de teclado — já corrigido na
   Sessão 4); o problema real era falta de **direção**: sem ▲/▼ touch não
   dava pra mirar ataque pra cima, fazer pogo (ataque pra baixo, que já
   exigia estar no ar — `entities.js` linha do `atkDir`) ou descer de
   plataforma vazada (↓ + pulo) no celular. A lógica de ataque já era
   genérica por ação (`In.pressed('up')`/`In.pressed('down')`, sem
   nenhuma referência hardcoded a teclado), então bastou adicionar os 2
   botões (`.dpad` em grid 3×3 substituindo o flex antigo de `.t-left`) —
   zero mudança de gameplay, só de input. O editor de layout de botões
   touch (`touch-layout.js`) já era genérico o bastante para reconhecer os
   2 novos botões automaticamente (nenhuma mudança nele foi necessária).

Testado via Playwright (viewport touch): rótulo "Protótipo v3" confirmado,
os 4 data-action do D-pad (`up`/`left`/`right`/`down`) presentes e
reconhecidos por `NV.Input.pressed()` ao simular toque, sem erros de
console. Screenshot conferida visualmente (menu e D-pad em jogo).

**Pedido grande, registrado mas NÃO implementado ainda — redesenho de
navegação estilo Silksong.** Cada região deveria ter 3+ opções de caminho
(ex.: entrada oeste → sobe por plataformas até outra área OU segue direto
pelo leste; variações por região), incentivando exploração/segredos, mais
uma mecânica de cipó/corda pra subir rápido em biomas florestais — **não
universal**, cada região com seu próprio recurso de traversal (o protótipo
já faz isso parcialmente via clima: vento em Picos, escuridão em Galerias,
areia em Vidraçal). Não implementado nesta sessão porque é mudança de
arquitetura, não ajuste de UI: hoje `js/world.js`/`js/game.js` modelam as 5
regiões como uma **corrente linear** (só entrada esquerda/direita, sem
bifurcação dentro de cada região). Registradas 3 perguntas de escopo pro
Diretor em `docs/09-roadmap/BACKLOG_PROTOTIPO.md` (seção "Pendências da
v3") antes de começar esse trabalho — não implementar às cegas um
redesenho desse tamanho.

**Estado ao final:** branch `prototype/v3-controles-inputs` com os 2 itens
pontuais prontos e pushados (ainda sem merge); item grande de navegação
aguardando resposta do Diretor às perguntas de escopo.

---

## Sessão 4 — 2026-07-25 (protótipo v2 mergeado + feedback de feel → v3)

O Diretor perguntou como jogar e se o deploy já tinha saído — a v2 ainda
estava só na branch. Autorizou o merge ("faça o merge"); mergeado em
`main` sem conflitos (`git merge --no-ff`) e o GitHub Pages redeployou
sozinho (workflow `pages.yml`, run concluído com sucesso). Protótipo v2 no
ar em https://marcospatrickexe.github.io/Nevora/.

Depois de jogar, o Diretor trouxe feedback de feel e um pedido de
acessibilidade, tudo implementado na branch `prototype/v3-controles-inputs`:

1. **Bug do pulo (W e Espaço "demoravam pra responder").** Investigado
   primeiro com um teste de latência pura via Playwright (comparando
   frames até `vx`/`vy` mudarem) — a física em si respondia em 1 frame,
   até mais rápido que o movimento lateral. O bug real apareceu num
   segundo teste, direcionado: `js/input.js` mapeava Espaço e W/↑ para a
   mesma ação `jump` através de uma variável auxiliar `_spaceHeld` que
   tentava reconciliar as duas teclas — soltar Espaço enquanto W ainda
   estava pressionado **cortava o pulo pela metade** (a mecânica de pulo
   variável via `!pressed('jump')` interpretava isso como "o jogador
   soltou o pulo"), e havia uma segunda inconsistência ao pressionar uma
   tecla enquanto a outra já mantinha a ação ativa. Corrigido reescrevendo
   o módulo do zero: cada ação agora é o **OU lógico de todas as teclas
   físicas que a controlam** (registro por tecla física + recomputação por
   ação), eliminando de vez a possibilidade de uma tecla sobrescrever o
   estado criado pela outra. Confirmado via teste automatizado antes/depois
   que ambos os bugs desapareceram.
2. **Habilidades no numpad.** Atacar/dash/curar/interagir ganharam binding
   padrão no teclado numérico (Numpad 5/6/8/2 — extremo direito, longe do
   WASD/setas), mantendo J/X, K/C, L/V, E/F como alternativa para quem não
   tem numpad (notebook).
3. **Diagrama de teclado ilustrado.** A tela de Controles ganhou um
   diagrama visual (HTML/CSS no estilo bronze/cera do jogo, não SVG
   externo) mostrando fisicamente onde cada tecla fica e o que ela faz,
   substituindo a tabela-só-texto que existia. Precisou de um ajuste de
   CSS: os overlays (`.overlay`) passaram de `align-items:center` fixo
   para `align-items:flex-start` + `overflow-y:auto` + `margin:auto` no
   `.menu-inner`, porque o diagrama deixou a tela de Controles alta demais
   para caber em telas menores sem cortar o topo/rodapé — agora rola
   internamente sem cortar nada, e continua centralizado quando cabe.
4. **Editor de layout dos botões touch** (novo módulo
   `js/touch-layout.js`, acessível pelo menu → "Editar botões na tela"):
   arrastar um botão reposiciona (`transform:translate`), arrastar uma
   bolinha no canto redimensiona (`transform:scale`, 0.6×–1.9×), tudo
   salvo em `localStorage` (`nv-touch-layout`) e reaplicado a cada load;
   botão "Redefinir padrão" limpa o override. `input.js` ganhou um modo
   `setEditingTouch()` para os botões não dispararem ações de jogo
   enquanto estão sendo arrastados.

Testado via Playwright: regressão completa da v2 sem erros (menu →
nickname → jogar → NPC → loja → pausa → resumo), bindings de numpad
funcionais, editor de layout com arrastar/redimensionar/reset confirmados
e persistência validada após reload de página.

**Estado ao final:** protótipo v3 implementado, testado e pushado para
`prototype/v3-controles-inputs` — aguardando o Diretor jogar e aprovar o
merge para `main`.

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

### Continuação 2 — fichas completas de Brasme e Parafino (mesmo dia)

O Diretor confirmou: fazer as fichas de arte completas de Brasme (Vigia) e
Parafino (Funileiro) no mesmo padrão de 24 itens dos outros 4. Feito e
publicado em `art/ACENDEDORES_REDESIGN.md` (seções 3.5 e 3.6) — documento
renomeado de "Redesenho dos Quatro Acendedores" para "Redesenho dos Seis
Acendedores". Ambos seguem a linguagem de formas dos Acendedores (corpo-vela,
proporção, olhos verticais) com os elementos de classe aplicados como
material/acessório, não substituindo a base:
- **Brasme** (Vigia): corpo em barril coberto por placas de bronze
  rebitadas, visor semicircular perfurado no lugar do rosto (só as fendas +
  a chama comunicam expressão — sinalizado como ponto de atenção único na
  tabela de validação, já que ele não tem "rosto" tradicional), sino de
  bronze embutido no pulso esquerdo.
- **Parafino** (Funileiro): corpo remendado com placas aparafusadas e
  válvulas de latão, lente de aumento sobre um olho, tubos de vapor nas
  costas, chave-ferramenta multiuso articulada na mão esquerda.

Tabela de validação do documento expandida para as 6 classes — todas
aprovadas (nenhuma descumpre mais de 2 critérios). Todas as pendências de
"ficha de arte" foram removidas de `CLASSES_ACENDEDORES.md`, `DECISOES.md`
(ADR-014) e `docs/README.md`. **Única pendência restante do pacote de
classes:** a paleta exata das 4 cores de slot do multiplayer (não
bloqueante). Nada implementado em código.

### Continuação 3 — ADR-015/016, fichas de boss, arte dos 6 Acendedores e Protótipo v2 (mesmo dia)

O Diretor respondeu a uma leva de pendências e autorizou implementação:

1. **Regra de progresso do visitante em co-op → ADR-015 🟢 aceita.** Texto
   literal do Diretor: *"ele volta pra onde eu estou no meu progresso. Se eu
   estiver afrente dele, ele vai surgir no mesmo ponto que estou."* O
   visitante spawna sempre no ponto de progresso do anfitrião; ao retornar,
   seu próprio progresso continua intacto. Ganhos portáteis (Sévia,
   Fagulhas, consumíveis, XP de forja, itens novos para ele) sempre contam;
   eventos de mundo (bosses, faróis) só contam no mundo do anfitrião. Escrito
   em `05-multiplayer/MULTIPLAYER_DESIGN.md`.
2. **Paleta de slot do multiplayer → ADR-016 🟢 aceita (decisão delegada:
   "c) você decide").** Identidade de slot (1-4) passa a usar dois canais
   não relacionados à cor de chama: "pips" em formato de gota (1 a 4) +
   4 tons pálidos dessaturados (J1 `#F5EFDC`, J2 `#F0D9E2`, J3 `#D9E4F0`,
   J4 `#DDEEDC`), deliberadamente distintos das 6 cores vivas de classe.
   Ajustável após playtest real com 4 jogadores. Escrito em
   `art/PLAYER_CHARACTER_DESIGN.md`.
3. **8 fichas de boss criadas** em `docs/04-gameplay/bosses/` (uma por
   arquivo + README de índice): Besouro-Sineiro, Ceifadeira-Murmúria,
   Broca-Mãe, Vidraceiro, Barqueiro Afogado, General Geada, Regente Oca,
   Pavio-Rei (final, 3 fases, liga com os 3 finais). Cada ficha cobre
   identidade/lore, arena, moveset por fase, escala 1-4 jogadores,
   recompensas, trilha e checklist anti-cópia. Marcadas 🟡 aguardando
   revisão do Diretor. `docs/04-gameplay/BOSSES.md` atualizado para apontar
   para a pasta nova.
4. **6 retratos de personagem gerados** (um por classe: Breo, Sílice,
   Véspera, Turfo, Brasme, Parafino) em SVG (`prototype/art/svg/`) →
   renderizados em PNG via Playwright/Chromium headless, seguindo o
   processo aprovado "Cuphead" (filtro de traço line-boil + textura de
   papel + gradiente radial de chama, ADR-010). A primeira versão de
   `personagem-vespera.svg` saiu quebrada (dois paths sobrepostos de capa
   assimétrica geraram um vão branco feio e uma "corrente" flutuante em vez
   de diadema) — reconstruída com um único path de corpo sólido + capa como
   overlay + diadema em pontos ancorados na curva da cabeça; padrão a
   reutilizar em capas assimétricas futuras. Galeria em `prototype/art/`
   reorganizada em duas seções ("As 6 Classes" / "Mundo e UI"). Marcados 🟡
   aguardando revisão do Diretor; **upload pro Google Drive pendente** — o
   conector caiu no meio da sessão (ver nota operacional acima).
5. **Protótipo v2 implementado por completo** na branch
   `prototype/v2-loja-audio-nickname` (criada a partir de `main`, **não
   mergeada**), cobrindo o backlog aprovado (*"3- Sim, pode implementar.
   4- perfeito 5-perfeito 6-showww"* + pedido de áudio próprio sem
   downloads):
   - `js/audio.js` (novo): SFX e trilha 100% sintetizados via Web Audio API
     (osciladores + ruído filtrado), zero arquivos externos.
   - `js/save.js` (novo): progresso local em `localStorage`
     (`nv-progress-v2`) — nickname, região mais distante, mortes, inimigos
     derrotados, Sévia coletada, segredos, upgrades, tempo jogado — com
     `summaryText()` gerando um resumo em texto puro copiável (rota simples
     sem backend; backend real fica para uma v3 futura, per o próprio
     Diretor: *"vamos fazer um backend no futuro, na outra versão do
     protótipo"*).
   - Economia de **Sévia**: inimigos derrotados soltam a moeda
     (`SeviaPickup`, ímã até o jogador); HUD ganhou contador no canto
     superior direito.
   - **Loja do Tio Sebo**: NPC no Vale das Velas, interação com **E**
     (tecla ou botão touch), congela a simulação do mundo enquanto aberta,
     vende Fragmento de Coração (+1 vida máx.) e Frasco de Fulgor (+1 pip
     máx.) com preço crescente a cada compra.
   - **3 áreas secretas** atrás de plataformas escondidas (Vale das Velas,
     Galerias Fúngicas, Picos Uivantes): 2 Fragmentos de Coração + 1 Bota de
     Salto (pulo permanentemente mais alto).
   - **Novo clima** `embers` (brasas subindo) no Vale das Velas.
   - **Tela de nickname** obrigatória na primeira partida; **tela de
     resumo** acessível do menu e da pausa, com botão "copiar resumo".
   - Testado com smoke test headless (Playwright/Chromium): fluxo completo
     menu → nickname → jogar → aproximar do NPC → abrir loja → tentar
     comprar → fechar loja → pausar → ver resumo → voltar, **sem erros de
     console**. Screenshots conferidos visualmente (NPC, loja, resumo).
   - Commitado e **pushado para a branch** (`git push -u origin
     prototype/v2-loja-audio-nickname`) — não mergeado em `main`, então o
     GitHub Pages **não republicou** (disciplina de branch respeitada).

**Estado ao final:** ADR-015 e ADR-016 fechadas; 8 fichas de boss e 6 artes
de personagem prontas, aguardando revisão do Diretor; Protótipo v2
implementado, testado e pushado — aguardando o Diretor jogar e aprovar o
merge para `main`. Multiplayer real (Colyseus) e backend de progresso
seguem adiados por decisão explícita do Diretor.

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

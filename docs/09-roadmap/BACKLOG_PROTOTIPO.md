# Backlog do Protótipo Web

> Status: 🟡 registrado, aguardando ordem do Diretor para iniciar cada item.
> Este backlog é só do **protótipo greybox** (`prototype/`) — feature
> aprovada aqui não é automaticamente escopo do jogo final; quando fizer
> sentido, a ideia também é refletida em `docs/04-gameplay/` etc. (já feito
> para loja/economia e lampião, ver commits desta sessão).

## Regra de processo (🟢 decidida) — branch por versão do protótipo

O deploy no GitHub Pages só acontece em push na `main`
(`.github/workflows/pages.yml`, `branches: [main]`). Ou seja: **construir
numa branch nunca publica nada** — só o merge final para `main` publica.
Fluxo combinado:

1. Cada leva de mudanças do protótipo nasce numa branch:
   `prototype/vN-descricao-curta` (ex.: `prototype/v2-loja-e-save-nomes`).
2. Trabalho e commits acontecem só nessa branch — o Pages não reage a ela.
3. Quando o Diretor aprovar o resultado (testado localmente ou via preview),
   faz-se o **merge para `main`** — só então o Actions publica a versão nova
   em `https://marcospatrickexe.github.io/Nevora/`.
4. Sugestão adicional (opcional, ativável nas configurações do GitHub em
   *Settings → Branches → Branch protection rules* para `main`): exigir Pull
   Request antes do merge. Isso formaliza o "só publica quando eu decidir" —
   até push direto na main fica bloqueado sem PR revisado.
5. Cada versão publicada pode ganhar uma **tag** (`git tag proto-v2` após o
   merge) para conseguirmos voltar a qualquer versão anterior facilmente.

Isso já é exatamente o comportamento pedido pelo Diretor — não foi preciso
nenhuma mudança no workflow, só adotar a disciplina de branch. Registrado
aqui e em `CLAUDE.md`.

---

## Itens do backlog (ordem de menção, não de prioridade)

> ✅ **Todos os itens 1–6 abaixo já foram implementados** (protótipos v2 e
> v3) — mantidos aqui como registro histórico do pedido original. Detalhe
> técnico de cada um em `prototype/README.md` (seções "Novidades da v2/v3")
> e em `docs/00-processo/DIARIO_DE_BORDO.md`.

### 1. Áudio ✅ implementado (v2)
Trilha e SFX **100% sintetizados via Web Audio API** (osciladores + ruído
filtrado, zero arquivos externos) — `prototype/js/audio.js`. Na v3.3 ganhou
variação melódica de verdade (escala musical + arpejo por região, antes
era só um drone de 2 notas).

### 2. Tela de nickname + identificação de jogador ✅ implementado (v2)
Ao clicar "Jogar", pedir nome/apelido antes de começar. Objetivo: testes com
amigos, saber **quem** chegou onde (bosses derrotados, áreas alcançadas,
versão do protótipo zerada).
- Nome fica salvo em `localStorage` junto ao save individual.
- **Limitação importante a decidir com o Diretor:** o protótipo é hospedado
  como site estático (GitHub Pages) — não tem backend. Duas rotas possíveis:
  - **(a) Rota simples (recomendada para já):** cada amigo joga no próprio
    aparelho; ao fim de uma sessão, uma tela de "resumo" mostra
    nome + progresso (bosses/áreas/versão) e gera um **código/texto
    copiável** que o amigo manda pro Diretor (Discord/WhatsApp) — sem
    servidor nenhum, funciona hoje.
  - **(b) Rota com backend leve (futuro):** um serviço pequeno (ex.:
    Cloudflare Worker + KV, ou Firebase) recebe o progresso automaticamente
    e alimenta um placar visível pelo Diretor. Vira uma decisão de
    infraestrutura (custo, LGPD básico de nomes) — melhor tratar como ADR
    própria quando chegarmos nela.

### 3. Loja (Tio Sebo) + economia de compra ✅ implementado (v2)
Design já registrado em `docs/04-gameplay/PROGRESSAO.md` (seção "A Loja de
Tio Sebo"): vitrine isca cara desde cedo, Fragmentos de Coração como item
mais caro, Artes/magias com cargas limitadas recarregadas só em Lampião.
NPC clicável (tecla/botão **E**), preço sobe a cada compra, mundo congela
com a loja aberta.

### 4. Upgrades comprável/encontrável ✅ implementado (v2)
Bota de Salto (pulo mais alto) encontrável em segredo; Fragmento de
Coração e Frasco de Fulgor compráveis na loja. Novas Artes/magias e dash
extra seguem como ideia pra fases futuras do protótipo.

### 5. Áreas secretas com itens exclusivos ✅ implementado (v2/v3.3)
Pelo menos 1 segredo por região do protótipo — hoje são 8 regiões, todas
com segredo próprio. Reforça o pilar "exploração recompensada" já
documentado.

### 6. Mais clima dinâmico nos cenários ✅ implementado (v1–v3.3)
O Diretor destacou a neve com vento dos Picos Uivantes como ponto alto —
"cenários com dinamismo e movimento... mostram que o jogo está vivo". Hoje
toda região tem seu próprio clima/efeito (chuva, brasas, areia, escuridão
com halo, neve com vento) — mais os perigos ambientais da v3.3 (lava, água
pútrida, água gelada com blocos de gelo móveis), que aumentam ainda mais
essa sensação de "o espaço é vivo e é desafio". Ação original:
aumentar a frequência/variedade de efeitos de clima animado nas próximas
versões (todas as 5 regiões, não só Picos), e considerar 1–2 efeitos novos
(ex.: folhas caindo no Bosque já existe como chuva — adicionar vento
visível balançando elementos do cenário).

### 7. Comunicação multiplayer entre jogadores (sincronizar ações em tempo real) 🟡 decidido (ADR-012), ainda não implementado no protótipo

Pergunta do Diretor: com até 4 jogadores em salas (1–4 jogadores por sala,
ADR-005), como transmitir rápido uma ação como "jogador 1 pulou" para que
os outros vejam na hora? Cogitou usar **WebSocket**. Análise completa de
arquitetura de rede do jogo final já existe em `05-multiplayer/NETCODE.md` —
resumo da resposta dada ao Diretor:

**WebSocket — prós:** nativo do navegador, sem lib obrigatória; confiável e
ordenado (TCP — mensagem sempre chega, sempre em ordem); atravessa
firewalls/NAT com facilidade (usa porta HTTPS padrão, sem STUN/TURN);
fácil de debugar (texto/JSON numa conexão simples); modelo cliente-servidor
autoritativo natural (servidor decide a verdade, dificulta trapaça);
Socket.IO (lib popular sobre WebSocket) já dá "rooms", reconexão automática
e fallback de transporte prontos.

**WebSocket — contras:** head-of-line blocking do TCP (um pacote perdido
trava tudo que vem depois — pode gerar soluço de latência perceptível em
jogo de ação rápida); não é o ideal pra volume alto de dados de posição a
60×/s em rede ruim (WebRTC DataChannel "não confiável/não ordenado" se
comporta melhor nesse caso específico, porque um pacote de posição
perdido não trava nada — o próximo já chega atualizado); precisa de
servidor rodando o tempo todo (não é P2P puro).

**Recomendação dada:** WebSocket é a escolha certa para esta fase de teste
— a diferença de latência do TCP só costuma incomodar de verdade em
cenários competitivos ou redes ruins; para testes com amigos em rede
doméstica é imperceptível, e a simplicidade de implementação/debug vale
mais agora. Detalhe importante: **Colyseus** (biblioteca já escolhida na
stack final, ADR-002) *usa WebSocket por padrão* — ou seja, existe a opção
de já montar o protótipo de rede com Colyseus desde já, o que faria esse
trabalho **não ser descartável**: ele viraria o início de verdade do
netcode do jogo final, em vez de algo jogado fora na Fase 1.

**🟢 Decidido (ADR-012, 2026-07-24):** Colyseus (WebSocket) já — o Diretor
vai testar com amigos que moram na mesma cidade (latência baixa por
natureza), então WebSocket puro atende bem essa fase, e o trabalho não é
descartável — reaproveita direto na stack final (ADR-002).

**⚠️ Nota para não esquecer (o Diretor fez questão de registrar):** validar
com amigos na mesma cidade **não é a mesma coisa** que estar pronto para a
Steam, onde os jogadores vão estar espalhados geograficamente e a robustez
de rede precisa ser bem maior. Antes do lançamento, revisitar com testes de
latência real — forte candidata: **Steam Datagram Relay (SDR)**, tecnologia
gratuita da Valve via Steamworks Networking Sockets, feita exatamente para
esse problema (relay global, resolve NAT automaticamente, nunca expõe IP).
Detalhes em `05-multiplayer/NETCODE.md` e `08-publicacao/PUBLICACAO.md`.

---

## Ordem sugerida (a confirmar com o Diretor no próximo prompt)

Como o Diretor disse que tem mais itens a adicionar antes de começarmos,
esta lista **não** define prioridade de execução ainda — é só o registro
fiel do que foi pedido nesta sessão, esperando a ordem final de ataque.

---

## Pendências da v3 ✅ mergeada e no ar desde 2026-07-29

> Registro histórico de implementado × pendente, pedido pelo Diretor em
> 2026-07-29, depois de testar a v2 publicada. **A v3 já foi mergeada em
> `main` há muito tempo** — mantido como registro do pedido original. Para
> o estado atual do protótipo (v3.1/v3.2/v3.3 e o hotfix de cache), ver a
> seção "Releases desde a v3" logo abaixo, ou `docs/00-processo/DIARIO_DE_BORDO.md`
> → "Estado atual".

### ✅ Implementado nesta rodada (commits em `prototype/v3-controles-inputs`)
1. Correção da latência/corte do pulo (W × Espaço) — já estava feito antes
   deste pedido (ver seção "Novidades da v3" do README).
2. Habilidades no numpad + diagrama de teclado ilustrado — idem, já feito.
3. Editor de layout dos botões touch — idem, já feito.
4. **Número da versão do protótipo na tela de menu** ("Protótipo v3"), para
   o Diretor sempre saber qual build está testando; também aparece no
   resumo de progresso.
5. **D-pad de 4 direções no touch** (▲▼ além de ◀▶): o botão de pular no
   celular já funcionava (não tinha o mesmo bug do W/Espaço, que era
   exclusivo de teclado); o que faltava de verdade era **direção** —
   sem ▲/▼ touch não dava pra mirar ataque pra cima, fazer pogo (ataque
   pra baixo no ar) ou descer de plataforma vazada (↓ + pulo) no celular.
   A lógica de `atkDir` em `entities.js` já era genérica por ação
   (`In.pressed('up')`/`In.pressed('down')`), então só faltava o botão —
   nenhuma mudança de gameplay, só de input.

### ✅ Implementado — redesenho de navegação multi-caminho (Silksong-like) + cipós

O Diretor respondeu as 3 perguntas de escopo (2026-07-29): (1) as rotas
devem levar a **regiões diferentes**, mesmo que demore mais; (2) cipó só
no Bosque Murmurante, e recurso de traversal próprio pras outras 4 regiões
também; (3) juntar tudo na v3 e só mergear depois de tudo pronto e
testado. Implementado por completo nesta mesma branch
`prototype/v3-controles-inputs`:

- **Grafo de regiões** (`js/world.js`/`js/game.js` reescritos): trocada a
  corrente linear por id (`prev`/`next` na cadeia principal, `portals`
  para saídas verticais topo/fundo). O protótipo foi de 5 pra **8
  regiões**: as 5 originais + 3 regiões-atalho novas (Sótão do Sineiro,
  Adega de Cera, Copa do Bosque), cada uma com 1 segredo exclusivo.
  Topologia completa em `docs/03-mundo/MAPA.md` (seção "Protótipo web").
- **Cipó** (só Bosque Murmurante → Copa do Bosque): tile climbável novo,
  segurar ↑/↓ sobe/desce sem gravidade, pular solta.
- **Recurso de travessia próprio por região** (nenhum repetido igual):
  Vale = brasas ascendentes (leva ao Sótão) · Bosque = cipó · Galerias =
  cogumelo-mola (bounce pad) · Vidraçal = vórtice de areia (leva a um
  segredo novo) · Picos = vento uivante (já existia, reaproveitado).
- Alçapão no chão do Vale (sem mecânica nova, só level design) leva à
  Adega de Cera.
- Testado via Playwright: cada portal/mecânica isoladamente (manipulação
  direta de estado, determinístico), cadeia principal completa ida e
  volta, os 7 segredos (4 novos + 3 antigos) coletáveis sem erro, resumo
  de progresso mostrando "regiões visitadas X/8", e regressão completa da
  UI (numpad, D-pad touch, editor de layout, loja, pausa, resumo) — zero
  erros de console. **Bug real encontrado e corrigido nesse processo:**
  `collectSecret` em `entities.js` chamava `g.showToast(...)`, que nunca
  existiu no objeto de estado (só como `NV.Game.showToast`) — ou seja,
  coletar **qualquer** segredo (inclusive os 3 que já existiam antes desta
  sessão) quebrava o jogo com uma exceção não tratada. Corrigido expondo
  `g.showToast` em `js/game.js`.

---

## Releases desde a v3 ✅ (registro resumido — detalhe completo no Diário de Bordo)

Todas mergeadas em `main` e publicadas com sucesso. Changelog técnico
completo em `prototype/README.md` ("Novidades da vN"); narrativa
sessão-a-sessão em `docs/00-processo/DIARIO_DE_BORDO.md` (Sessões 7-9).

- **v3.1 (2026-07-30):** hotfix de cache do service worker (botões touch
  ficaram bagunçados numa v3 já publicada — cache preso numa versão
  anterior ao D-pad).
- **v3.2 (2026-07-30):** botão de pausa touch; posição preservada nas
  transições de região (X proporcional, Y por gravidade/preservado).
- **v3.3 (2026-07-31):** visibilidade em Galerias Fúngicas, correção do
  bug de grafo (backtracking pro lugar certo), tela de Mapa (contorno real
  do terreno, estilo Silksong), tela de Configurações, música com
  variação melódica, **3 perigos ambientais** (lava/água pútrida/água
  gelada — ADR-017) e **sistema de 6 classes jogáveis** com passiva
  funcional cada (ADR-018).
- **Hotfix pós-v3.3 (2026-08-01):** cache-busting automático (SHA do
  commit) + `fetch()` rede-primeiro — corrige de vez o tipo de incidente
  da v3.1, de forma estrutural (ADR-019).

## Pendências abertas (atualizado 2026-08-01)

1. **Próximas áreas do mapa** além das 8 atuais, inspiradas na diversidade
   de bioma/paleta do mapa-múndi de referência do Silksong
   (`docs/referencias/mapas/`) — regra de paleta-por-região já formalizada
   em `CLAUDE.md`; aguardando ordem do Diretor pra desenhar as áreas.
2. **2 habilidades ativas + técnica exclusiva** de cada uma das 6 classes
   (a passiva de cada uma já está implementada — ADR-018).
3. Revisão do Diretor: 8 fichas de boss (`docs/04-gameplay/bosses/`) e os
   6 retratos de personagem (`prototype/art/png/personagem-*.png`).
4. Upload dos 6 retratos de personagem para o Google Drive do Diretor —
   o conector existe mas não fica habilitado nas sessões de chat CCR (ver
   nota operacional no Diário de Bordo); enquanto isso, assets novos ficam
   salvos no próprio repositório.
5. Modelo comercial da versão web (demo grátis × pago) — Diretor: "depois
   vemos".
6. Multiplayer de verdade (Colyseus/WebSocket, ADR-012) — decidido, ainda
   não implementado no protótipo.

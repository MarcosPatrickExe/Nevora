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

### 1. Áudio 🟡 (adiado — confirmado pelo Diretor)
Trilha e SFX do protótipo. Depende de decisões de `07-arte-audio/AUDIO.md`.
Fica para depois das próximas rodadas de gameplay.

### 2. Tela de nickname + identificação de jogador
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

### 3. Loja (Tio Sebo) + economia de compra
Design já registrado em `docs/04-gameplay/PROGRESSAO.md` (seção "A Loja de
Tio Sebo"): vitrine isca cara desde cedo, Fragmentos de Coração como item
mais caro, Artes/magias com cargas limitadas recarregadas só em Lampião.
Falta: implementar no protótipo (NPC clicável, UI de compra, persistência
do inventário no save).

### 4. Upgrades comprável/encontrável
Pulo maior, dash extra, novas Artes/magias — alguns na loja (caros), alguns
só em áreas secretas (grátis, mas escondidos). Ver item 5.

### 5. Áreas secretas com itens exclusivos
Pelo menos 1 segredo por região do protótipo, com item que **não existe na
loja** (arma alternativa, magia rara, Fragmento de Coração "grátis"). Reforça
o pilar "exploração recompensada" já documentado.

### 6. Mais clima dinâmico nos cenários
O Diretor destacou a neve com vento dos Picos Uivantes como ponto alto —
"cenários com dinamismo e movimento... mostram que o jogo está vivo". Ação:
aumentar a frequência/variedade de efeitos de clima animado nas próximas
versões (todas as 5 regiões, não só Picos), e considerar 1–2 efeitos novos
(ex.: folhas caindo no Bosque já existe como chuva — adicionar vento
visível balançando elementos do cenário).

### 7. Comunicação multiplayer entre jogadores (sincronizar ações em tempo real)

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

## Pendências da v3 (branch `prototype/v3-controles-inputs`, ainda não mergeada)

> Registro de implementado × pendente pedido pelo Diretor em 2026-07-29,
> depois de testar a v2 publicada (a v3 ainda não tinha ido ao ar). Antes
> de reabrir pedido de merge, comparar sempre esta lista com o que já
> existe na branch para não duplicar trabalho.

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

### 🔴 Pendente — redesenho de navegação multi-caminho (Silksong-like) + cipós

Pedido do Diretor: cada região deve ter **pelo menos 3 opções de caminho**
ao ser explorada (ex.: entra pelo oeste → sobe por plataformas até outra
área **ou** segue direto pelo leste; outras regiões variam: só pra cima,
só pra baixo, cima+baixo, etc.), incentivando exploração e achado de áreas
secretas. Regiões de bioma florestal podem ter **cipós/cordas** para subir
mais rápido até o topo — mas isso é **por região, não universal**: cada
área deve ter um recurso de traversal próprio (o protótipo já faz isso
parcialmente com clima: vento que empurra em Picos Uivantes, escuridão com
halo de luz em Galerias Fúngicas, tempestade de areia em Vidraçal).

**Por que isso ainda não foi implementado junto com os itens acima:** é uma
mudança de arquitetura, não um ajuste de UI. Hoje (ver `js/world.js` e
`js/game.js`):
- As 5 regiões do protótipo formam uma **corrente linear** (índice 0→4),
  conectadas só por bordas esquerda/direita (`entryLeft`/`entryRight`,
  `g.level.index ± 1`). Não existe conceito de saída por cima/por baixo,
  nem de "voltar pra uma região por dois lugares diferentes".
  Cada região hoje é um corredor único (largura 60 tiles, alguns degraus
  de plataforma), sem bifurcação nenhuma.
- Implementar o pedido do Diretor de verdade exige: (a) trocar a "corrente"
  por um **grafo de regiões** (uma região pode ter múltiplas saídas, para
  regiões diferentes ou pontos diferentes da mesma região); (b) redesenhar
  o traçado de tiles das 5 regiões existentes para ter bifurcações reais
  (não só decoração — rotas que levam a lugares diferentes); (c) uma
  mecânica nova de escalada (tile "cipó", estado de personagem "agarrado
  subindo", input dedicado) — nenhuma dessas três coisas existe hoje.

**Perguntas antes de começar** (Diretor, por favor responda quando puder;
não vou implementar isso às cegas):
1. As **3+ rotas** devem levar a **regiões diferentes** (expandindo a
   topologia de 5 regiões pra algo mais parecido com o grafo real do jogo
   final em `03-mundo/MAPA.md`), ou são **desvios dentro da mesma região**
   (a rota de cima e a de baixo convergem de volta ao mesmo corredor mais
   à frente, só que uma tem um segredo e a outra é mais rápida)? A segunda
   opção é bem mais rápida de fazer no protótipo atual; a primeira é
   praticamente redesenhar o mapa do zero.
2. Cipó/corda: confirma que é só no **Bosque Murmurante** (única região de
   bioma florestal hoje) pra essa v3, ou quer o recurso de traversal único
   também desenhado agora pras outras 4 regiões (ex.: vento ascendente nos
   Picos, corrente subaquática em algum lugar etc.)? Pode ser feito aos
   poucos, região por região.
3. Isso é bloqueante pro merge da v3 pra `main`, ou pode entrar como uma
   v4 separada depois que a v3 (correção do pulo + numpad + editor touch +
   d-pad + versão no menu) for pro ar e testada?

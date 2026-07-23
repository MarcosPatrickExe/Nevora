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

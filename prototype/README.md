# Névora — Protótipo Web (Fase 1, greybox)

Protótipo jogável para validar cedo: menu inicial, movimentação, combate,
comportamento de inimigos e a estrutura de regiões interligadas. **A arte é
placeholder procedural** (com "line boil" ensaiando o traço à mão do estilo
final — ADR-010); as regras de verdade do jogo moram em [`../docs/`](../docs/).

## Como rodar

Precisa de um servidor HTTP simples (PWA/service worker não funcionam via
`file://`). Na pasta `prototype/`:

```bash
# opção 1 — Python
python3 -m http.server 8080

# opção 2 — Node
npx serve .
```

Abra `http://localhost:8080`. Para testar como PWA: acessar pelo celular na
mesma rede (ou publicar via GitHub Pages) e usar "Adicionar à tela inicial".

## O que tem dentro

- **Menu principal** com fundo animado, tela de controles e pausa (Esc).
- **8 regiões em grafo** (não mais uma corrente única — ver "Navegação
  multi-caminho" abaixo), a cadeia principal de 5 mais 3 regiões-atalho:
  1. Vale das Velas — Besourito Sineiro (patrulha + investida) · hub com
     3 saídas (leste, e as 2 verticais abaixo)
  2. Bosque Murmurante — Mariposa-Serra (voa e mergulha) · chuva
  3. Galerias Fúngicas — Esporão (torreta de esporos) · **escuridão com halo
     de luz do jogador** (o raio cresce com o Fulgor)
  4. Vidraçal — Formiga-Vidro (bote rápido, frágil) · tempestade de areia ·
     espinhos de vidro
  5. Picos Uivantes — Vespa-Geada (projétil de gelo) · neve e **vento que
     empurra no ar** · região final
  6. Sótão do Sineiro — atalho vertical a partir do Vale (brasas)
  7. Adega de Cera — atalho vertical a partir do Vale (alçapão)
  8. Copas do Bosque — atalho vertical a partir do Bosque (cipó)
- **Combate:** golpe em 3 direções (frente/cima/baixo), **pogo** no ataque
  para baixo, hit stop, hit flash, partículas, knockback.
- **Movimentação:** aceleração curta, pulo variável, coyote time, input
  buffer, dash com i-frames, descer de plataforma vazada (↓ + pulo).
- **Fulgor:** golpes enchem o medidor; curar gasta 3 pips.
- **Lampiões:** acender = ponto de retorno + vida cheia (morte volta ao
  último lampião).
- **Controles touch** aparecem automaticamente em dispositivos touch/PWA
  (configurável no menu: Auto/Sempre/Nunca). Com teclado, uma tela de
  mapeamento é mostrada antes da primeira partida.
- **PWA:** manifest + service worker cache-first (funciona offline após o
  primeiro load).

### Novidades da v2

- **Áudio 100% sintetizado** (Web Audio API, sem nenhum arquivo externo):
  pulo, dash, ataque, dano, morte de inimigo, cura, lampião aceso, segredo
  encontrado, loja e uma trilha ambiente diferente por região.
- **Nickname local:** antes da primeira partida o jogo pede um apelido
  (salvo só neste aparelho) para identificar o resumo de progresso.
- **Sévia:** inimigos derrotados soltam a moeda do protótipo, que voa até o
  jogador (ímã) e some com um coletável se não for pega em 6s.
- **Loja do Tio Sebo** (Vale das Velas): aproxime-se do NPC e aperte
  **E** (ou o botão touch "E") para abrir/fechar. Vende Fragmento de
  Coração (+1 vida máx.) e Frasco de Fulgor (+1 pip máx.), preço sobe a
  cada compra. O mundo congela enquanto a loja está aberta.
- **Áreas secretas:** 3 itens escondidos atrás de plataformas ocultas —
  2 Fragmentos de Coração e 1 Bota de Salto (pulo mais alto, permanente).
  Marcados com um brilho dourado; ficam salvos entre sessões.
- **Clima novo:** brasas subindo no Vale das Velas (`weather: 'embers'`).
- **Resumo de progresso** (menu e pausa → "Meu resumo"): região mais
  distante, inimigos derrotados, Sévia coletada, segredos, upgrades,
  mortes e tempo jogado — com botão para copiar como texto (rota simples
  sem backend; o backend de verdade fica para uma v3 futura).
- Progresso (nickname, segredos, upgrades, região alcançada, stats) fica em
  `localStorage`, separado do save antigo.

### Novidades da v3

- **Correção de latência do pulo:** o pulo aceitava Espaço e W/↑ através de
  um mapeamento frágil (uma variável `_spaceHeld` tentando reconciliar as
  duas teclas). Isso causava dois bugs reais: soltar Espaço enquanto W
  ainda estava pressionado cortava o pulo pela metade (a mecânica de "pulo
  variável" interpretava como se o botão de pulo tivesse sido solto), e em
  certas combinações o toque ficava "preso". Reescrito do zero
  (`js/input.js`): cada ação agora é o **OU lógico de todas as teclas
  físicas** que a controlam, sem uma tecla conseguir sobrescrever o estado
  criado pela outra. Testado com Playwright: pulo responde em 1 frame
  (~17ms), igual ou mais rápido que o movimento lateral.
- **Habilidades no numpad:** por padrão, atacar/dash/curar/interagir agora
  vivem no teclado numérico (extremo direito, longe do WASD/setas) —
  Numpad 5 (atacar, tem o relevo tátil pra achar sem olhar), Numpad 6
  (dash), Numpad 8 (curar), Numpad 2 (interagir). As teclas antigas (J/X,
  K/C, L/V, E/F) continuam funcionando como alternativa para quem não tem
  numpad (notebook).
- **Diagrama de teclado ilustrado:** a tela de Controles agora mostra um
  desenho do teclado, no estilo visual do jogo, destacando fisicamente onde
  cada tecla fica e o que ela faz — ao invés de só uma tabela de texto.
- **Editor de layout dos botões touch** (menu → "Editar botões na tela"):
  arraste qualquer botão para reposicionar, arraste a bolinha do canto para
  redimensionar. Fica salvo em `localStorage` (sobrevive a fechar o
  navegador/app); botão "Redefinir padrão" volta ao layout original.
- **Número da versão no menu:** a tela inicial mostra "Protótipo v3" (fonte
  única `NV.VERSION` em `js/main.js`) para saber sempre qual build está em
  teste; o resumo de progresso também registra a versão jogada.
- **D-pad de 4 direções no touch:** os controles de celular/PWA tinham só
  ◀/▶. Adicionados ▲/▼ — necessários porque ataque pra cima, pogo (ataque
  pra baixo no ar) e descer de plataforma vazada (↓ + pulo) dependiam de
  segurar uma direção, algo que só o teclado conseguia fazer antes.
- **Navegação multi-caminho (inspirada em Silksong):** as regiões deixaram
  de ser uma corrente única — o Vale das Velas e o Bosque Murmurante agora
  têm saídas verticais escondidas, cada uma levando a uma região-atalho
  pequena com um segredo próprio, que reconecta à cadeia principal num
  ponto diferente. Ver "Navegação multi-caminho" abaixo.

### Novidades da v3.2

- **Botão de pausa touch** (canto superior esquerdo): antes só dava pra
  pausar pelo Esc do teclado — no celular/PWA não existia forma nenhuma de
  pausar o jogo.
- **Correção de posição nas transições de região:** os portais verticais
  (brasas, alçapão, cipó) jogavam o jogador sempre no canto inferior
  esquerdo da região de destino, ignorando de onde ele veio. Agora a
  posição **X é preservada proporcionalmente** (ex.: caiu num ponto a 1/4
  da largura da região de origem → chega a 1/4 da largura da região de
  destino) e o **Y fica livre pra gravidade** — cai a partir do teto do
  destino (se saiu pelo chão) ou emerge do chão do destino (se saiu pelo
  teto), em vez de sempre "teleportar" pra uma posição fixa seguro.
  Transições **laterais** (esquerda/direita) agora também preservam a
  **altura Y** do jogador quando existe chão ou plataforma correspondente
  na região vizinha — antes sempre resetava pro chão principal. Para essa
  preservação ter efeito de verdade, Vale, Bosque e Vidraçal ganharam
  plataformas extras perto das bordas laterais (variando a altura em que
  dá pra atravessar pra região vizinha).

### Novidades da v3.3

- **Visibilidade melhor em Galerias Fúngicas:** a escuridão tinha um raio de
  luz pequeno demais e esmaecia desde o centro — difícil de jogar sem
  conhecer o layout de cor. Raio de luz aumentado e com um "platô" de
  visão plena (60% do raio totalmente claro, só o restante esmaece),
  mantendo o clima de escuridão sem prejudicar a jogabilidade.
- **Corrige bug real de navegação no grafo:** voltar andando por uma região
  que tem mais de uma entrada possível (ex.: Galerias Fúngicas, alcançável
  tanto pelo Bosque Murmurante quanto pelo atalho do Sótão do Sineiro)
  sempre te levava de volta pro vizinho "padrão" da cadeia principal,
  **não** pra região de onde você realmente veio. Corrigido registrando de
  verdade de onde o jogador entrou em cada região (`g.enteredFrom`/
  `g.enteredSide` em `js/game.js`) — voltar agora sempre devolve pro lugar
  certo. As regiões-atalho continuam de mão única *pelo portal* (não dá
  pra descer de volta pelo mesmo cipó/brasas/alçapão), mas andar de volta
  dentro da cadeia principal agora funciona corretamente não importa por
  onde você entrou. Também adicionadas paredes de segurança nas 3
  regiões-atalho (antes era possível "vazar" pra fora do mapa pela borda
  sem parede).
- **Tela de Mapa** (botão "M" no teclado, ou o botão touch com esse ícone,
  ambos do tipo *toggle* — aperta de novo pra fechar, não precisa segurar):
  mostra o grafo das 8 regiões, com a região atual destacada (pulsando) e
  as já visitadas marcadas na cor de destaque de cada uma.
- **Tela de Configurações** (⚙, tanto no menu principal quanto na pausa):
  volume de música e de efeitos (sliders, salvos em `localStorage`), além
  do que já existia (Botões na tela: Auto/Sempre/Nunca, e o editor de
  posição/tamanho dos botões touch) — tudo centralizado num só lugar.
- **Música com variação melódica de verdade:** antes cada região tocava só
  um drone de 2 osciladores dessintonizados (soava como "uma nota só").
  Adicionada uma camada de arpejo aleatório por cima do drone, usando uma
  escala musical diferente por região (pentatônica maior no Vale, dórico
  no Bosque, frígio nas Galerias — mais tenso/escuro, etc.), com notas
  soltas em intervalos e oitavas levemente variados — mesmo espírito
  ambiente, mas sem soar estático.

## Navegação multi-caminho

```
                Sótão do Sineiro (brasas)      Copas do Bosque (cipó)
               /                        \     /                      \
Vale das Velas — Bosque Murmurante — Galerias Fúngicas — Vidraçal — Picos Uivantes
               \                                                      /
                Adega de Cera (alçapão) ————————————————————————————
```

- **Vale das Velas** é o hub: além de seguir reto pro Bosque, dá pra subir
  (coluna de brasas quentes, empurram o Acendedor pra cima — segure
  qualquer direção, é só ficar na coluna) até o **Sótão do Sineiro**, ou
  descer por um alçapão no chão até a **Adega de Cera**. As duas regiões
  levam de volta à cadeia principal (Galerias e Vidraçal, respectivamente)
  por um caminho diferente do óbvio.
- **Bosque Murmurante** tem um **cipó** (segure ↑ ou ↓ perto dele pra
  subir/descer, pule pra soltar) que leva até a **Copa do Bosque**, um
  atalho que pula direto pra Picos Uivantes — ignorando Galerias e
  Vidraçal por completo, se o jogador preferir essa rota.
- Cada região-atalho tem **1 segredo exclusivo** (Fragmento de Coração),
  recompensando quem sai da rota óbvia.
- Recurso de travessia próprio por região (nenhum se repete igual):
  Vale = brasas ascendentes · Bosque = cipó · Galerias = cogumelo-mola
  (bounce pad, usado no caminho principal) · Vidraçal = vórtice de areia
  (leva a um segredo próprio, novo nesta versão) · Picos = vento uivante
  (já existia, usado pro segredo escondido "atrás do vento").
- As regiões-atalho são **mão única** (não dá pra voltar por elas) — a
  cadeia principal continua com ida e volta normal (ex.: Bosque ↔ Vale).

## Controles (teclado)

| Tecla | Ação |
|---|---|
| ← → / A D | mover |
| Espaço / W / ↑ | pular (segure p/ mais altura) |
| Numpad 5 *(ou J / X)* | atacar (com ↑ para cima; no ar com ↓ = pogo) |
| Numpad 6 *(ou K / C)* | dash |
| Numpad 8 *(ou L / V)* | curar (gasta 3 Fulgor) |
| Numpad 2 *(ou E / F)* | interagir / falar com NPCs |
| Esc | pausar |
| M | abrir/fechar o Mapa (toggle) |

## Controles (touch/PWA)

D-pad (◀▶▲▼) para movimento/direção + botões de ação (✚ curar, ⇢ dash,
✦ atacar, ▲ pular) + ⚙ pausar (canto superior esquerdo) + botão "M" pra
abrir/fechar o Mapa (canto superior direito, também toggle). Segurar ▲ ou
▼ enquanto aperta ✦ mira o ataque pra cima/baixo (pogo pra baixo exige
estar no ar, igual ao teclado); segurar ▼ e apertar pular desce de
plataforma vazada.

## Limitações conhecidas (de propósito)

- Sem multiplayer ainda (Fase 3 do roadmap) — mas as entidades já usam
  estrutura compatível com "4 slots".
- Arte procedural: os desenhos finais serão feitos à mão e digitalizados.
- Sem backend: nickname e progresso ficam só no aparelho (localStorage);
  um backend real para armazenar isso entre dispositivos é uma v3 futura.
- Código vanilla JS sem build para iteração rápida — a stack definitiva
  (TypeScript + PixiJS + Colyseus) entra na Fase 1 real (ADR-002).

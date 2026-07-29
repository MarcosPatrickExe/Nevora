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
- **5 regiões interligadas** (ande até a borda da tela para trocar):
  1. Vale das Velas — Besourito Sineiro (patrulha + investida)
  2. Bosque Murmurante — Mariposa-Serra (voa e mergulha) · chuva
  3. Galerias Fúngicas — Esporão (torreta de esporos) · **escuridão com halo
     de luz do jogador** (o raio cresce com o Fulgor)
  4. Vidraçal — Formiga-Vidro (bote rápido, frágil) · tempestade de areia ·
     espinhos de vidro
  5. Picos Uivantes — Vespa-Geada (projétil de gelo) · neve e **vento que
     empurra no ar**
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

## Controles (touch/PWA)

D-pad (◀▶▲▼) para movimento/direção + botões de ação (✚ curar, ⇢ dash,
✦ atacar, ▲ pular). Segurar ▲ ou ▼ enquanto aperta ✦ mira o ataque pra
cima/baixo (pogo pra baixo exige estar no ar, igual ao teclado); segurar ▼
e apertar pular desce de plataforma vazada.

## Limitações conhecidas (de propósito)

- Sem multiplayer ainda (Fase 3 do roadmap) — mas as entidades já usam
  estrutura compatível com "4 slots".
- Arte procedural: os desenhos finais serão feitos à mão e digitalizados.
- Sem backend: nickname e progresso ficam só no aparelho (localStorage);
  um backend real para armazenar isso entre dispositivos é uma v3 futura.
- Código vanilla JS sem build para iteração rápida — a stack definitiva
  (TypeScript + PixiJS + Colyseus) entra na Fase 1 real (ADR-002).

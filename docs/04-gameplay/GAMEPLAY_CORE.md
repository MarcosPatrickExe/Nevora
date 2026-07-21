# Gameplay Core — Movimentação e Combate

> Status: 🟡 Proposta. Este documento define o "game feel" alvo — o coração do
> projeto. Nada aqui é final até ser validado num protótipo jogável (Fase 1).

## Movimentação

### Conjunto base (do início do jogo)
- Corrida com aceleração curta (~4 frames até velocidade máxima — resposta
  imediata, sem "patinar").
- Pulo com altura variável (soltar o botão corta o impulso).
- **Coyote time** (~6 frames) e **input buffer** (~8 frames) desde o dia 1.
- Agachar/descer de plataformas semissólidas.
- Ataque básico em 4 direções (frente, cima, baixo no ar = **pogo**).

### Conjunto adquirido (ordem flexível, ver `03-mundo/MAPA.md`)
Dash (com i-frames curtos) → Planar → Wall cling/jump → Duplo salto → Gancho →
Nado profundo → Chama Plena.

### Constantes de feel (valores iniciais p/ protótipo, em unidades de tile)
| Parâmetro | Alvo inicial |
|---|---|
| Velocidade de corrida | 9–10 tiles/s |
| Altura de pulo (mín/máx) | 1,5 / 4 tiles |
| Gravidade subida vs. queda | queda ~1,8× mais forte |
| Duração do dash | 0,18 s, ~5 tiles |
| Velocidade terminal | limitada (leitura de queda) |

> Método: gravar vídeo do protótipo a 60 fps e revisar frame a frame. O feel é
> aprovado por gameplay teste, nunca por número.

## Combate

### Fundamentos
- **Rápido e agressivo:** recuperação curta dos golpes, cancelamento de ataque
  em dash, combos naturais sem lista de comandos decorada.
- **Pogo é identidade:** quicar em inimigos/perigos com ataque para baixo é
  central no level design e nos bosses (como nas melhores referências).
- **Parry ("Rebate de Cera"):** janela de ~8 frames; rebater projéteis e abrir
  postura de elites. Recompensa alta, nunca obrigatório fora de 2 bosses.
- **Feedback total:** hit stop (2–4 frames), hit flash, partículas, tremor de
  tela sutil (com toggle de acessibilidade), som em camadas.

### Recursos do jogador
- **Vida:** corações de cera (início: 5). Upgrades permanentes via fragmentos.
- **Fulgor (recurso ativo):** acertar golpes enche o medidor de Fulgor da
  chama; gastar em: **Sopro Restaurador** (cura canalizada) ou **Artes de
  Chama** (golpes especiais da arma equipada). Dilema constante curar × dano.
- **Sévia (moeda):** economia de upgrades/compras. Perde-se parcialmente na
  morte (ver Eco de Cera em `PROGRESSAO.md`).

### Dificuldade e acessibilidade
- Sem seletor de dificuldade tradicional; dificuldade emerge do build e das
  rotas (padrão do gênero) **+ painel de acessibilidade honesto**:
  - reduzir tremor de tela/flashes, alto contraste, remapeamento total;
  - modo assistido opcional (dano recebido -X%, marcado no save) — inclusão
    sem comprometer identidade; a discutir.
- **Em co-op a dificuldade escala:** vida/postura dos inimigos +~35% por
  jogador extra, e certos ataques de boss ganham alvos múltiplos. Nunca
  escalar dano recebido (frustração barata).

## Inimigos (filosofia)

- ~45 tipos, **cada bioma com 5–7 espécies próprias** + 2–3 variantes globais.
- Regra dos 3: todo inimigo tem no máx. 3 comportamentos legíveis; a
  dificuldade vem da **combinação** de inimigos na sala, não de HP inflado.
- Elites "Encinzados" (versões cobertas de fungo, padrão extra + drop melhor).
- IA ciente de múltiplos alvos: agro alternado, ataques em área quando os
  jogadores se agrupam (anti-"bolinho"), flanqueio leve. Detalhes no futuro
  `IA_INIMIGOS.md`.

## HUD (minimalista)

- Canto sup. esq.: corações + medidor de Fulgor (a própria chama do jogador).
- Canto inf.: Sévia (aparece só ao mudar) + slots de ferramenta.
- Aliados: mini-retrato com chama da cor do jogador + corações (compacto).
- Nada de minimapa permanente (mapa em tela cheia/overlay rápido) — a discutir.

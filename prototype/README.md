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

## Controles (teclado)

| Tecla | Ação |
|---|---|
| ← → / A D | mover |
| Espaço / W / ↑ | pular (segure p/ mais altura) |
| J / X | atacar (com ↑ para cima; no ar com ↓ = pogo) |
| K / C | dash |
| L / V | curar (gasta 3 Fulgor) |
| Esc | pausar |

## Limitações conhecidas (de propósito)

- Sem multiplayer ainda (Fase 3 do roadmap) — mas as entidades já usam
  estrutura compatível com "4 slots".
- Arte procedural: os desenhos finais serão feitos à mão e digitalizados.
- Sem áudio nesta versão.
- Código vanilla JS sem build para iteração rápida — a stack definitiva
  (TypeScript + PixiJS + Colyseus) entra na Fase 1 real (ADR-002).

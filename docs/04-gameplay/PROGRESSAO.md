# Progressão, Economia e Morte

> Status: 🟡 Proposta

## Eixos de progressão

1. **Habilidades de movimento** (gating do mapa) — ver `03-mundo/MAPA.md`.
2. **Arsenal** (armas + ferramentas) — ver `ARMAS_E_FERRAMENTAS.md`.
3. **Atributos permanentes:**
   - *Fragmentos de Coração* (4 → +1 coração de cera; 8 espalhados no mundo);
   - *Gotas de Fulgor* (aumentam o medidor de Fulgor; 6 no mundo);
   - upgrades de forja (dano/efeitos por arma).
4. **Selos de Cera** (sistema de build) — abaixo.
5. **Progresso de mundo:** faróis acesos, atalhos, NPCs resgatados, vila
   crescendo (progressão visível e social).

## Selos de Cera (build system)

Medalhões de cera prensada equipáveis nos **Entalhes** do personagem
(3 entalhes no início → 6 no máximo; Selos custam 1–3 entalhes).

- ~30 Selos na v1.0, em 4 famílias:
  - **Ofensiva:** ex. *Pavio Duplo* (Artes custam menos), *Cera Fervente*
    (golpes queimam), *Sino Rachado* (crít ao quebrar postura).
  - **Defensiva/sustain:** ex. *Casca de Sebo* (+1 hit absorvido por lampião),
    *Mecha Longa* (cura canaliza mais rápido).
  - **Exploração:** ex. *Antenas Finas* (segredos "soam" perto), *Patas de
    Cerda* (sem dano de espinhos leves).
  - **Cooperação (exclusivos co-op):** ex. *Chama Trançada* (curar-se cura
    aliado próximo 50%), *Juramento da Fornada* (revive mais rápido; ressoa se
    ambos usarem), *Luto Dividido* (morte de aliado enche seu Fulgor).
- Troca livre **apenas em Lampiões** (decisão de build importa na expedição).
- Sugestão a discutir: Selos "rachados" (versões amaldiçoadas mais fortes com
  desvantagem) como recompensa de desafios opcionais.

## Economia — **Sévia**

- Fontes: inimigos, depósitos nos cenários, quests, venda de relíquias achadas.
- Ralos: forja (upgrades), mapas da Pavia, ferramentas do Tio Sebo, Escavador
  (atalhos pagos), cosméticos da vila, respec.
- Meta: o jogador médio deve sentir **escassez leve nos Atos 1–2** (escolhas
  reais) e conforto no Ato 3.

### A Loja de Tio Sebo — filosofia de preços 🟢 (diretriz do Diretor, 2026-07-23)

O caracol-mercador **Tio Sebo** (ficha completa em `art/NPC_AND_BOSS_DESIGN.md`)
é o vendedor natural do jogo — a concha-loja já é, por design, "chamativa":
iluminada por dentro, cheia de potes e lamparinas balançando. Ele aparece na
vila de Pavio e, mais raro, em pontos remotos do mapa (loja itinerante).

- **Vitrine isca:** todo Tio Sebo mostra 1–2 itens de ponta na vitrine —
  armas/ferramentas/magias avançadas — **visíveis desde muito cedo, mas com
  preço alto o suficiente para exigir progresso real** antes de comprá-los.
  O objetivo é gerar desejo declarado ("quero aquilo") que puxa o jogador a
  explorar mais e lutar mais para juntar Sévia.
- **Fragmentos de Coração (o +1 Coração de Cera permanente) são o item mais
  caro da loja**, de propósito: vida extra é poder puro e permanente, não
  deve ser trivial de comprar. 🟢 (ADR-013) Compram-se com **Fagulhas** — uma
  moeda separada da Sévia, dropada **exclusivamente por inimigos mortos** —
  o que amarra a compra de vida especificamente ao combate (farm de
  combate obrigatório para essa rota), diferente do resto da loja que usa
  Sévia normal. Preço sobe a cada fragmento já comprado (curva crescente), e
  alguns fragmentos só existem em **áreas secretas** (grátis, nunca à
  venda) — combinação de compra + exploração, nunca só uma ou só outra.
- **Artes de Chama / magias com uso limitado:** cada Arte tem um número de
  cargas que só recarrega em Lampiões (aprofunda o padrão já existente do
  Fulgor). As Artes mais fortes têm **menos cargas e custam mais** — poder
  em rajada, não em torneira aberta.
- **Itens raros de área secreta nunca estão na loja.** Isso mantém a loja
  como "caminho garantido, mas caro" e os segredos como "caminho grátis, mas
  escondido" — dois trajetos válidos para o mesmo poder, coerente com o pilar
  de exploração recompensada (`03-mundo/MAPA.md`).

## Morte — sistema **"Eco de Cera"**

Queremos a tensão do corpse-run sem a dupla punição que atrapalha em co-op:

- **Solo:** ao morrer, o jogador derruba um **Eco de Cera** (estátua de si) com
  **70% da Sévia carregada**; 30% se perde. Recuperar o Eco = tudo de volta +
  pequena carga de Fulgor. Morrer de novo antes de recuperar **não destrói** o
  Eco antigo (fica apenas o mais recente com 70% acumulado — menos cruel que a
  referência, mais dinâmico).
- **Co-op — regra de queda:** ao zerar a vida, o jogador fica **Derretendo**
  (caído, rastejando, 15 s): aliado pode reviver (canalização 3 s, acelerável
  com Sino/Selos). Se ninguém reviver, vira Eco e **renasce no último Lampião
  do grupo** — a sessão não para.
- **Wipe do grupo** (todos caídos): grupo volta ao Lampião, inimigos resetam,
  Ecos ficam onde caíram.
- **Em boss:** jogador que virou Eco renasce automaticamente se o grupo vencer
  a luta (ver a vitória da arquibancada dói o bastante).

## New Game+ (pós-lançamento, backlog)

- Remix de inimigos (Encinzados desde o início), Selos exclusivos, 4º nível de
  forja, boss rush na arena da Vigília. Registrar já no roadmap, produzir depois.

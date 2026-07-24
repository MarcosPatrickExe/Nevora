# Ficha de Boss 07 — A Regente Oca
> Criada pelo agente para revisão do Diretor · Status: 🟡 aguardando revisão
> Região: Colmeia Partida · Boss obrigatório de fim do Ato 2
> Ficha visual completa já existe em `art/NPC_AND_BOSS_DESIGN.md` — esta
> ficha cobre o lado de GAMEPLAY (moveset/arena/escala), que ainda faltava.

## Identidade & lore
Abelha-autômato construída pelos Acendedores antigos para manter a colmeia
produzindo Sévia depois que a rainha verdadeira morreu — uma mentira
funcional, linda e vazia. É o retrato do pecado da ordem: manter as
aparências de vida onde só resta mecanismo. Guarda a Geleia-Real, chave
para o Selo Radicular do Ato 3.

## Arena
Câmara hexagonal central da Colmeia, ~26 tiles, com **paredes que giram
lentamente** ao longo da luta (mecânica do bioma) — plataformas de favo
mudam de posição, obrigando releitura constante do espaço.

## Fases e moveset
**Fase 1 (100%→65%) — dourada, postura régia:**
- **Ordem hexagonal** — projeta um padrão de luz hexagonal no chão; áreas
  marcadas explodem em sequência 1s depois (puzzle de leitura + movimento).
- **Ferrão de coroa** — investida giratória usando a coroa como broca;
  reta e telegrafada, punível por trás.
- **Zumbido de comando** — chama 2 autômatos-operárias menores (dano baixo,
  interrompem combo do jogador) — ensina prioridade de alvo.

**Fase 2 (65%→30%) — placas rachadas, mel preto:**
- Movimentos ficam **quebrados/assimétricos** (ela está falhando):
  Ordem hexagonal agora tem padrões irregulares (menos previsível, mas
  mais lenta pra compensar).
- **Vazamento** — poças de mel preto no chão desaceleram quem pisa; ela
  as usa deliberadamente para cercar o jogador.
- **Curto-circuito** — brilha instável 1s antes de um golpe aleatório
  entre os 3 anteriores — ensina reação genérica, não memorização pura.

**Fase 3 (30%→0%) — coroa solta, perda total da postura:**
- A coroa se solta e passa a girar sozinha pela arena como perigo
  ambiental extra (dano de contato, ignora as regras dela mesma).
- Todos os golpes anteriores se combinam sem padrão fixo; luz artificial
  da chama dela pisca — a "morte" da Regente é visualmente uma queda de
  energia, não uma explosão.

## Escala co-op
- 2J: +35% HP; Zumbido de comando chama 1 operária extra por jogador.
- 3–4J: Ordem hexagonal marca áreas para cada jogador simultaneamente
  (mais leitura, não mais dano); paredes giram mais rápido.

## Recompensas
Geleia-Real de Cera (item de progressão, obrigatório) · 300 Sévia ·
70 Fagulhas · abre o Selo Radicular (Ato 3).

## Trilha
Órgão de câmara mecânico (soa "vivo" na fase 1, dissonante na fase 2,
falho/intermitente na fase 3) — a trilha decai junto com a personagem.

## Checklist anti-cópia
✅ autômato-rainha vazia é conceito próprio (não é "rainha insana", é uma
farsa que nunca teve escolha) · ✅ arena rotativa é mecânica do bioma, não
genérica · ✅ 3 fases = 3 estados de colapso mecânico, não 3 formas
aleatórias.

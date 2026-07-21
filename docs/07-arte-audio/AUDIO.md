# Áudio e Trilha Sonora

> Status: 🟡 Proposta

## Direção musical

- **Identidade:** orquestra de câmara pequena + **instrumentos de "cera e
  madeira"** (marimba, celesta, cordas pizzicato, sinos) + texturas de campo
  (asas, cliques, gotas). Tema recorrente do jogo: o **"Motivo da Chama"** (4
  notas), que aparece variado em cada bioma e explode no final.
- Cada bioma: 1 faixa de exploração (camadas) + 1 de combate; cada boss
  principal: faixa própria com motivo do personagem.
- **Música adaptativa por camadas:** exploração calma → camadas entram com
  proximidade de perigo/combate (crossfade por estado do jogo, não por trigger
  brusco).
- Vila de Pavio: tema caloroso que **ganha um instrumento novo a cada NPC
  resgatado** (a vila literalmente soa mais viva — detalhe que os jogadores
  amam descobrir).

## SFX

- Regra de feedback: todo golpe tem 3 camadas (swing + impacto material +
  resposta da criatura). Materiais soam certos: quitina ≠ cera ≠ vidro ≠ mel.
- Sons de jogador levemente **tonais por cor de chama** (co-op audível: você
  reconhece o parry do seu amigo de ouvido).
- Áudio 2D posicional (pan + atenuação por distância; útil com câmeras
  independentes para saber onde o aliado está).

## Voz

- Sem dublagem falada: "insectês" — vocalizações curtas por personagem
  (sílabas sopradas/cliques, estilo referências do gênero). Barato, charmoso,
  internacional por natureza.

## Técnica (web)

- Web Audio API: sprites de áudio, pooling de vozes, limite de vozes
  simultâneas, ducking (música abaixa no parry perfeito/golpe final de boss).
- Formatos: opus/ogg + fallback aac (iOS). Streaming das músicas, SFX em
  memória.
- Mix: master/música/sfx/ui separados nas opções + modo "noite" (compressão).

## Acessibilidade sonora

- Legendas para eventos sonoros críticos (opcional): "⚠ estrondo à direita".
- Pistas visuais redundantes para todo telegraph sonoro de boss.

# Multiplayer — Design Cooperativo

> Status: 🟡 Proposta. Este é o pilar nº 1 do projeto: o metroidvania que
> Hollow Knight/Silksong nunca deixaram jogar com amigos.

## Formato

> 🟢 **Regra de ouro (ADR-005, palavra do Diretor):** *"O desenvolvimento deve
> ser construído inicialmente para dois jogadores, mas a arquitetura, os
> identificadores, a interface e os protocolos devem nascer preparados para
> quatro. Isso evita reescrever o multiplayer depois."*
>
> Na prática: player index 0–3 em todo o código, estado de sala com 4 slots,
> HUD desenhado com layout para 4 desde o primeiro mockup, 4 cores de chama
> reservadas, protocolos e saves dimensionados para 4 — mas conteúdo,
> balanceamento e playtests focam em 2 até a Fase 4.

| Decisão | Proposta |
|---|---|
| Jogadores | 1–4 (construído para **2**, pronto para 4 — ADR-005) |
| Modelo | Co-op drop-in/drop-out em sala privada (convite/código) |
| Progresso | Mundo do anfitrião avança; visitantes **mantêm progresso pessoal** (armas, Selos, corações) e sincronizam flags de mundo próprias por regra clara (abaixo) |
| Sessão | Online via servidor; **sem MMO, sem matchmaking público** na v1.0 |
| Local | Couch co-op (mesma tela) — desejável, decidir na Fase 2 (impacta câmera) |

### Regra de progresso do visitante (proposta "Expedição")
Para evitar o problema clássico de "joguei na sessão do amigo e não valeu nada":
- **Sempre valem para o visitante:** Sévia, itens consumíveis, XP de forja,
  Selos/armas coletados que ele ainda não tinha, fragmentos de coração.
- **Valem se o visitante ainda não passou daquele ponto:** bosses derrotados e
  faróis acesos são registrados como "testemunhado" — ao chegar lá no próprio
  mundo, o jogador pode **relutar ou reivindicar** (reivindicar exige ter
  estado presente na vitória). A discutir — alternativa mais simples: só conta
  no mundo do anfitrião, como Elden Ring.

## Câmera — parametrizável 🟢 (ADR-006)

> **Glossário rápido — "couch co-op":** co-op local, no sofá ("couch"): 2+
> pessoas no MESMO aparelho/tela, cada uma com um controle. Diferente do co-op
> online, onde cada jogador está no próprio dispositivo.

Decisão do Diretor: o estilo de câmera é um **parâmetro da sessão** — o grupo
alterna entre os dois modos nas opções (e o anfitrião pode trocar em jogo, em
área segura):

1. **Modo Elástico** — todos na mesma tela, câmera com zoom dinâmico que
   engloba o grupo; limite de distância com aviso + teleport suave de
   reagrupamento. Social, ideal para couch co-op e duplas que jogam "coladas".
2. **Modo Independente** — cada cliente vê a própria câmera; permite
   exploração dividida real ("eu vou pelo poço, você pela copa") — a killer
   feature do nosso pitch. Requer simulação por área ativa no servidor.

Defaults: online = independente · couch = elástico (obrigatório em tela
única). Ambos podem ser trocados pelo grupo.

**Consequências para o level design:** toda sala/puzzle/boss deve funcionar
nos dois modos (nunca exigir jogadores em pontas opostas do mapa; arenas de
boss cabem no enquadramento elástico com 4 jogadores).

## Mecânicas cooperativas (o tempero)

- **Revive "Derretendo"** (ver `04-gameplay/PROGRESSAO.md`).
- **Calor de Companhia:** buff de lampião em grupo.
- **Sinergias de arma** (cada classe tem 1 — ver armas).
- **Selos de Cooperação** (família exclusiva de builds co-op).
- **Ping da Bolhinha:** marcação de mundo sem chat de voz (acessível e fofa).
- **Emotes/gestos** (comunicação mínima embutida + chat de texto opcional).
- **Puzzles de peso/dupla com alternativa solo** (regra: 100% possível solo,
  mais divertido em dupla; caminhos co-op são atalhos, nunca exclusivos —
  exceto os segredos co-op listados em BIOMAS.md, a discutir).
- **Trilha paralela do Duelista** reforça o tema: ele zomba de grupos ("uma
  chama basta"), e o jogo prova o contrário.

## Anti-frustração co-op

- Loot instanciado (cada jogador coleta sua Sévia/itens — zero briga de drop).
- Zero dano entre aliados (Selo opcional "Chama Cega" ativa friendly fire para
  duos hardcore — a discutir).
- Visitante nunca destrava porta/lore à frente do anfitrião sem consentimento
  (prompt de "avançar história?" para eventos-chave).
- Pausa: solo pausa de verdade; co-op não pausa (menu overlay).

## Solo continua sagrado

O jogo inteiro é 100% completável e balanceado solo (fantasma de referência:
Silksong solo). O co-op adiciona textura, nunca requisito. Cada sistema novo
declara na doc como se comporta em 1/2/3/4 jogadores.

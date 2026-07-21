# Estrutura do Mapa e Navegação

> Status: 🟡 Proposta (topologia atualizada para as 18 regiões do ADR-007)

## Topologia geral (diagrama conceitual, por camadas)

```
ALTURAS                      [10. Picos Uivantes]
                                      │
COPAS      [3. Ninhal das Mariposas]──┤
                      │               │
           [2. Bosque Murmurante]─────┼──────[8. Colmeia Partida]
                      │               │               │
SUPERFÍCIE [4. Jardins Gotejantes]    │               │
                      │               │               │
       [1. VALE DAS VELAS + Vila Pavio]───────────────┤
                      │               │               │
MÉDIO      [5. Estrada dos Correios]──┼──[6. Vidraçal]┘
                      │               │        │
           [7. Fundição Adormecida]   │   [9. Grutas de Âmbar]
                      │               │        │
PROFUNDEZAS [11. Galerias Fúngicas]───┼────────┘
                      │               │
           [13. Arquivo de Sebo]      │
                      │               │
           [12. Pântano da Maré Baixa]┤
                      │               │
           [14. Cripta dos Moldes]────┤
                      │               │
           [15. Cerélia Afundada]─────┤────[17. Abismo dos Esporos]
                      │               │
           [16. Raizal Faminto]───────┤
                                      │
                        [18. Coração da Cinza]
```

- **Eixo vertical = profundidade narrativa:** quanto mais fundo, mais perto da
  verdade (e da árvore). Superfície = presente; profundezas = passado.
- O Vale das Velas é o **cruzamento central**: toca 5 regiões — hub de verdade.
- A **Estrada dos Correios** é o "corredor expresso" horizontal do cinturão
  médio (papel de artéria, como as grandes rotas dos metroidvanias de mapa
  gigante).
- Cada região tem **2+ entradas** e pelo menos **1 atalho destrancável** em
  direção ao Vale (backtracking inteligente, regra herdada das referências).
- Regiões P (Grutas, Abismo) têm entradas secretas/tardias de propósito.

## Gating de progressão (grafo de habilidades)

Estrutura não linear controlada: após o Ato 1, sempre existem **2–3 destinos
possíveis** com a habilidade atual.

| Habilidade/Ferramenta | Onde se obtém | O que destrava (exemplos) |
|---|---|---|
| Faísca (inicial) | início | pavios, teias de bolor queimáveis |
| Dash | Galerias Fúngicas | vãos largos, esquiva de elite |
| Planar | Bosque Murmurante | correntes de vento, descidas do Vidraçal |
| Wall cling/jump | Picos Uivantes | poços verticais em todo o mapa |
| Pogo aprimorado (quebra) | Vidraçal | pisos de vidro/cristal, rotas verticais |
| Gancho de Crina | Pântano | pontos de gancho, travessias de teto |
| Duplo salto | Colmeia Partida | camadas altas de todos os biomas |
| Nado profundo | Cerélia Afundada | águas profundas, 100% do Pântano |
| Chama Plena (final) | Coração da Cinza | zonas de escuridão total, NG+ |

Regra de design: **toda habilidade nova reprecifica pelo menos 3 áreas já
visitadas** (motivo real para backtracking).

## Sistema de mapa (in-game)

- **Mapas da Pavia:** o jogador compra o rascunho do bioma com a Pavia (ou de
  postos dela); o mapa é *impreciso de propósito* (ela é cega) e vai sendo
  **corrigido automaticamente** conforme o jogador explora. Identidade própria:
  em vez de "comprar mapa + preencher" (HK), aqui o mapa *melhora de qualidade*
  (traço tremido → traço firme → iluminado).
- **Cantos de interesse:** marcador manual (pins) + ping cooperativo via
  Bolhinha (o vaga-lume voa até o ponto marcado pelo aliado).
- **Em co-op, exploração compartilhada:** o mapa revela o que *qualquer* membro
  do grupo explorou (incentiva split-up: "você vai por cima, eu por baixo").
  A discutir: modo hardcore com mapas individuais.

## Saves, respawn e viagem

- **Lampiões de Descanso** (equivalente autoral dos bancos): acender um lampião
  = save + respawn point + restaura vida + recoloca inimigos. Sentar em grupo
  ao redor do lampião dá um buff pequeno de partida ("Calor de Companhia" —
  só existe em co-op).
- **Viagem rápida:** rede de **Correios-Besouro** (montarias-estação
  desbloqueáveis, uma por bioma; cena de viagem curta e pulável). Destravadas
  ao reacender o farol regional — amarra mecânica ↔ narrativa.
- **Morte:** ver `04-gameplay/PROGRESSAO.md` (sistema "Eco de Cera", pensado
  para não punir dobrado em co-op).

## Métricas alvo de level design

| Métrica | Alvo (por porte G / M / P) |
|---|---|
| Salas por região | 30–40 / 18–25 / 8–15 |
| Total de salas do jogo | ~430–470 |
| Tempo de travessia (1ª visita) | 60–90 / 30–50 / 15–25 min |
| Segredos por região | 10–15 / 6–10 / 3–6 |
| Atalhos destrancáveis por região | 3–4 / 2–3 / 1–2 |
| Distância máx. lampião → boss | ≤ 60 s de corrida limpa |

> Regra dura (aprendida com as referências): **nunca** colocar um boss a mais
> de 1 min do respawn. Retry rápido é sagrado — ainda mais em co-op.

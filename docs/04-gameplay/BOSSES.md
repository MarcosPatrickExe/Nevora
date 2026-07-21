# Bosses e Minibosses

> Status: 🟡 Proposta — 8 principais + 6 opcionais + ~10 minibosses.
> Regra nº 1: **todo boss é testado e balanceado para 1, 2, 3 e 4 jogadores.**

## Filosofia de design

- Padrões legíveis, mortes que ensinam ("a culpa foi minha").
- Cada boss tem **identidade mecânica + identidade narrativa** (todos contam
  lore pela arena, aparência e comportamento).
- **Escala co-op:** +HP/postura por jogador; a partir de 2 jogadores o boss
  ganha *um* padrão adicional que mira o segundo alvo (nunca só esponja de HP).
- Retry a ≤ 60 s do lampião, sempre.

## Bosses principais (8)

| # | Boss | Local | Conceito mecânico | Recompensa |
|---|---|---|---|---|
| 1 | **Besouro Sineiro** | Vale das Velas | Tutorial de pogo e leitura: badaladas telegrafadas, ondas de som saltáveis | Coração de Pavio (farol 0) |
| 2 | **Ceifadeira Murmúria** | Bosque | Duelista elegante de alcance; ensina respeito a espaçamento; 2ª fase no vento | Foice de Quitina |
| 3 | **Broca-Mãe** | Galerias | Boss-perseguição em túneis + arena escura (luz como recurso) | Dash aprimorado + farol |
| 4 | **O Vidraceiro** | Vidraçal | Arena-funil de areia que puxa para o centro; plataformas de vidro que ele mesmo cria e o jogador quebra (pogo) | farol + rota vertical |
| 5 | **O Barqueiro Afogado** | Pântano | Luta em barca em movimento com maré subindo; fases alternam convés/água | Gancho de Crina + farol |
| 6 | **General Geada** | Picos | Duelo técnico com clima: nevasca em ciclos que apaga a chama (DPS check suave de aquecimento) | farol + wall cling |
| 7 | **A Regente Oca** | Colmeia | 2 fases: autômato perfeito → mecanismo exposto; salas giram durante a luta | Geleia-Real (chave do Ato 3) |
| 8 | **O Pavio-Rei** | Coração | 3 fases (montanha de cera → duelo espelho → escuridão vs. luz); final | Finais |

## Bosses opcionais (6)

| Boss | Local | Gancho |
|---|---|---|
| **Cri, o Duelista** ×3 | encontros itinerantes | Rival recorrente; 3 duelos com kits crescentes; recompensa: Lâminas Gêmeas (2º duelo) |
| **Gêmeas Tecelãs (Fia & Meada)** | Bosque profundo | Boss de dupla desenhado p/ co-op (alvos alternando invulnerabilidade); solo: padrão adaptado; recompensa: Fio de Âmbar |
| **Colecionador de Chamas** | Vidraçal oculto | Ladrão que roubou lampiões; devolve rede de viagem rápida extra; luta com "apagões" |
| **Leviatã da Cisterna** | Cerélia | Boss aquático colossal (única luta 100% nado) |
| **Campeão da Vigília** | Arena da vila | Gauntlet de arena; libera boss rush |
| **A Fornada Perdida** | segredo (Sementes de Lume) | Acendedores-protótipo corrompidos — espelho sombrio do grupo: **luta contra "cópias" dos próprios jogadores** (nº igual ao de jogadores) |

## Minibosses (~10, reutilizáveis como elites depois)

Guardiões de atalhos/segredos: Sargento Encinzado, Casulo Errante, Enxame-de-Um
(mosca que se multiplica), Carrasco do Mel, Sonâmbula (mariposa gigante que não
pode acordar — luta furtiva!), Broto do Pavio-Rei (prenúncio do final), etc.

## Estrutura de ficha de boss (padrão p/ documentação futura)

Cada boss ganhará um arquivo `bosses/NOME.md` com: fases e HP%, moveset
(startup/active/recovery em frames), padrões por nº de jogadores, arena
(diagrama), trilha (motivo musical), drops, lore e checklist anti-cópia.

## Sugestões em aberto

1. **Sonâmbula como luta de stealth** é risco/experimento — pode virar
   puzzle-boss. Validar em protótipo.
2. Boss secreto pós-final ("a Lumeira sonhando") para NG+ — backlog.
3. Modo "Rememorar" no lampião da arena: relutar qualquer boss vencido, com
   ranking de tempo (ótimo para co-op e replay). Recomendo aprovar cedo — é
   barato se planejado desde o início.

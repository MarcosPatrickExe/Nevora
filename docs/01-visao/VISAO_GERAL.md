# Visão Geral do Jogo

> Status: 🟡 Proposta — aberta para discussão

## Identidade

| Item | Definição |
|---|---|
| **Nome do jogo** | **NÉVORA** 🟢 (ADR-004; marca a registrar antes do anúncio) |
| **Gênero** | Metroidvania 2D de ação e exploração, cooperativo |
| **Jogadores** | 1–4; **construído para 2, arquitetura nascida para 4** (ADR-005) |
| **Plataforma inicial** | Navegador (desktop e mobile) + PWA instalável |
| **Plataformas futuras** | Steam, Epic Games Store, Google Play, App Store |
| **Classificação alvo** | Livre/10+ (violência fantasiosa leve, sem sangue realista) |
| **Idiomas no lançamento** | pt-BR e en-US (arquitetura preparada para mais) |
| **Sessão típica** | 20–60 min; campanha completa 25–35 h (100%: 45+ h) |

> **Névora** — nome do jogo **e do mundo** onde tudo acontece (como
> Fiarlongo/Pharloom em Silksong). De *névoa*: a bruma de esporos que apagou o
> mundo, e o nevoeiro que a luz dos jogadores rasga. Curto, sonoro, funciona em
> pt e en (pronúncia natural), sem colisão óbvia com IPs do gênero (pesquisa
> formal de marca pendente — ver `08-publicacao/PUBLICACAO.md`).

---

## O sonho que estamos realizando

Fãs de Hollow Knight e Silksong sempre quiseram explorar o mapa, cair em
segredos, morrer para chefes e voltar mais fortes **junto com os amigos** — e
isso nunca foi possível nesses jogos. Nosso diferencial nº 1 é ser **o
metroidvania de alta qualidade que se joga em co-op de verdade**: exploração
compartilhada, combate coordenado, e sistemas desenhados desde o dia zero para
mais de um jogador — não um multiplayer "colado" depois.

## Pilares de design (em ordem de prioridade)

1. **Co-op em primeiro lugar** — toda mecânica funciona e brilha com 2+ jogadores,
   sem quebrar a experiência solo.
2. **Controle absoluto** — resposta imediata, física previsível, animações que
   nunca roubam o controle do jogador (referências: Silksong, Celeste).
3. **Exploração recompensada** — cada desvio de caminho paga o jogador com algo:
   atalho, segredo, lore, upgrade.
4. **Mundo com identidade própria** — direção de arte, fauna, arquitetura e
   trilha 100% originais e reconhecíveis à primeira vista.
5. **Dinamismo acima do luto** — comparado ao Hollow Knight, nosso ritmo é mais
   rápido, mais aventura e menos melancolia: clima de expedição com amigos.

## Fantasia do jogador

> "Somos os últimos portadores da chama. O mundo apagou — nós vamos reacendê-lo,
> farol por farol, juntos."

O jogador começa **fraco**: uma arma simples (o Atiçador) e uma ferramenta
básica (a Faísca). Cada região dominada, cada chefe derrotado e cada segredo
encontrado transforma esse ser frágil em uma lenda — e a jornada de poder é
sentida no corpo: novos golpes, novos movimentos, novas formas de atravessar o
mapa.

## Loop de gameplay

**Loop de minuto:** mover-se com fluidez → enfrentar insetos corrompidos →
ler padrões → acertar/esquivar/aparar → coletar **Sévia** (moeda: seiva
luminosa cristalizada).

**Loop de hora:** explorar um bioma → encontrar o Lampião de Descanso (save) →
abrir atalhos → derrotar o miniboss/boss → ganhar habilidade ou ferramenta →
perceber que 3 lugares antigos agora são alcançáveis → backtracking feliz.

**Loop de campanha:** reacender os faróis regionais → desvendar a verdade sobre
a Cinza → tomar a decisão final (finais múltiplos).

## Escopo do lançamento v1.0 (🟢 aprovado — ADR-007: mapa grande)

| Conteúdo | Quantidade |
|---|---|
| Regiões do mapa | **18** (+ vila-hub) — 8 grandes / 7 médias / 3 de passagem |
| Salas totais | ~450 (escala Silksong) |
| Bosses principais | 8 |
| Bosses opcionais | 6 |
| Minibosses | ~14 (um por região sem boss principal) |
| Tipos de inimigos | ~60 |
| Classes de arma | 6 |
| Ferramentas | ~12 |
| Selos de Cera (build/charms) | ~30 |
| Finais | 3 |

> ⚠️ **Contingência registrada (não é o plano padrão):** se a produção da
> Fase 4 atrasar criticamente, existe a opção de lançar a v1.0 com as camadas
> Superfície+Médio completas e entregar as Profundezas finais em **"Atos"
> gratuitos** — atualizações de conteúdo sem custo que completam a história
> (modelo consagrado por Dead Cells/Hades em acesso antecipado). Decisão só na
> Fase 4, com dados reais de ritmo.

## O que este jogo NÃO é (anti-escopo)

- ❌ Não é roguelike/roguelite — o mapa é fixo e persistente.
- ❌ Não é PvP — sem combate entre jogadores na v1.0 (talvez arena futura).
- ❌ Não é MMO — salas privadas de até 4 amigos, sem mundo compartilhado público.
- ❌ Não tem microtransações, gacha ou energia. Modelo: **premium** (compra única)
  nas lojas; versão web pode ser demo/completa — a discutir.
- ❌ Não é procedural — level design 100% autoral.

# Ficha de Boss 08 — O Pavio-Rei (final)
> Criada pelo agente para revisão do Diretor · Status: 🟡 aguardando revisão
> Região: Coração da Cinza · Boss final do jogo (3 fases)
> Ficha visual completa já existe em `art/NPC_AND_BOSS_DESIGN.md` — esta
> ficha cobre o lado de GAMEPLAY (moveset/arena/escala/finais).

## Identidade & lore
O Primeiro Acendedor. Mergulhou no coração da Lumeira pra "salvar sua era"
e se fundiu à raiz e ao fungo. Não é maligno — é incapaz de aceitar o fim.
A luta inteira é a confrontação entre a recusa dele e a aceitação que os
jogadores representam. Mensagem central: o maior monstro de Névora é
alguém que um dia foi tão pequeno quanto os jogadores.

## Arena
Câmara radicular, escala colossal — a arena cresce/muda entre as 3 fases
(detalhado abaixo). Fase 3 usa a mecânica central do jogo invertida:
escuridão avança progressivamente, luz dos jogadores precisa ser mantida
ativamente.

## Fases e moveset

**Fase 1 — O Trono de Sebo (montanha de cera, arena vertical ~30x20 tiles):**
- **Braços incompletos** — 4-6 braços de cera atacam em sequência de
  diferentes pontos da arena (telegraph individual por braço, ritmo tipo
  "whack-a-mole" controlado).
- **Erupção de pavios** — pavios apagados na arena acendem em sequência
  marcando zonas de dano — ensina rota segura por leitura.
- **Invocação de servos** — pequenos servos de cera brotam da massa;
  fracos, mas em volume — pressão de adds.
- Transição de fase: a cera derrete revelando uma figura pequena no centro.

**Fase 2 — O Primeiro Acendedor (duelo 1:1, arena reduzida ~16x10 tiles):**
- Espelha o kit do PRÓPRIO jogador — dash, pogo, parry, Atiçador — mas com
  décadas de técnica: combos mais rápidos, cancelamentos mais precisos.
- **Rebate perfeito** — ele executa Rebate de Cera (parry) nos golpes do
  jogador; abre postura se o jogador variar o padrão de ataque.
- **Estocada Fundente espelhada** — a mesma Arte de Chama do Atiçador
  inicial, usada contra o jogador — reconhecimento emocional do "espelho".
- Ritmo: o boss mais rápido e "justo" do jogo — puramente sobre execução.

**Fase 3 — A Recusa (arena escurece progressivamente, luz é o recurso):**
- Ele se agarra à raiz-coração; a arena escurece em anéis que se fecham
  a cada ~20s (timer suave, não instantâneo).
- **Raízes-âncora** — tentáculos negros emergem do chão nas zonas ainda
  escuras — atacar a chama do jogador reduz o raio de luz temporariamente.
- **Grito da recusa** — periodicamente, um pulso de escuridão total por
  1,5s (i-frame do jogador cobre isso, mas cegueira visual real).
- Em co-op: dividir papéis emerge naturalmente — quem segura luz numa
  zona, quem ataca a raiz central. Vitória = manter luz suficiente até
  esgotar o HP final.

## Escala co-op
- 2J: +35% HP total; Fase 2 (duelo 1:1) passa a ser sequencial — cada
  jogador enfrenta um "eco" dele por vez, ou simultâneo com kit reduzido
  pela metade (a decidir em playtest — anotar como ⚠️ pendência de teste).
- 3–4J: Fase 1 escala braços/servos por jogador; Fase 3 tem mais anéis de
  escuridão simultâneos, mas mais luz total disponível (soma das chamas).

## Os 3 finais (gatilho na Fase 3, ver `02-narrativa/ENREDO.md`)
- **Vigília** (padrão): destruir o HP até 0 normalmente.
- **Amanhecer** (verdadeiro): requer as 7 Sementes de Lume coletadas antes
  da luta — abre uma ação alternativa na Fase 3 (plantar em vez de destruir).
- **Cinzas** (secreto): aceitar a oferta dele no início da Fase 2 (gatilho
  de diálogo/input especial) — pula direto para uma cutscene alternativa.

## Trilha
Motivo da Chama tocado por instrumento só (celesta) na Fase 1, cresce para
orquestra completa na Fase 2 (o "duelo" merece grandiosidade), e se reduz a
quase silêncio + batimento cardíaco na Fase 3 — inversão total do volume
conforme a luz diminui.

## Checklist anti-cópia
✅ boss final espelha o MOVESET DO JOGADOR (mecânica própria de callback,
não cópia de Hollow Knight/Radiance) · ✅ 3 finais amarrados à luta, não
tela de escolha genérica · ✅ escuridão-como-recurso é extensão direta da
identidade "Cera e Penumbra" do próprio jogo.

## ⚠️ Pendências de playtest (marcadas, não bloqueantes)
- Fase 2 em co-op: duelo sequencial vs. simultâneo kit-reduzido — decidir
  com teste real.
- Timer exato dos anéis de escuridão da Fase 3 (20s é placeholder).

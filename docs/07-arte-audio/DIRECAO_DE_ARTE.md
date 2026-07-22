# Direção de Arte

> Status: 🟡 Proposta — diretrizes para construir uma identidade visual
> própria e inconfundível (e juridicamente limpa).

## Conceito central: **"Cera e Penumbra"**

O mundo é definido pela relação entre **luz quente de chama** e **escuridão
fria de fungo**. Nossa assinatura visual:

1. **Materiais:** cera escorrida, bronze, quitina, mel, vidro, micélio — tudo
   no mundo parece **moldável, derretível, orgânico**. Arquitetura de velas e
   faróis, não de castelos.
2. **Luz é gameplay e é arte:** iluminação dinâmica 2D (luz da chama do
   jogador tinge o ambiente; cada jogador tem cor própria — a cena co-op de 4
   chamas coloridas num túnel escuro é o nosso cartão de visita).
3. **Paleta por bioma** (contraste imediato entre regiões):
   âmbar/dourado (Vale) · verde-chuva (Bosque) · azul-esporo (Galerias) ·
   laranja-vidro (Vidraçal) · verde-lodo/prata (Pântano) · branco/ciano
   (Picos) · dourado-mel (Colmeia) · azul-profundo (Cerélia) · cinza+sépia
   (Coração).
4. **A Cinza:** o fungo dessatura o que toca — inimigos corrompidos são
   literalmente **mais cinzentos** que o cenário (leitura instantânea de
   ameaça + tema visual da história).

## Estilo de produção — 🟢 decidido (ADR-010)

**Desenhado à mão e digitalizado** — todo elemento do jogo (personagens,
inimigos, cenários, props, UI ilustrada) deve parecer ter sido desenhado à
mão no papel e depois digitalizado, como o fluxo de produção de **Cuphead**
(referência de PROCESSO e acabamento; jamais de conteúdo, personagens ou
estética de época 1930s — nosso mundo continua sendo "Cera e Penumbra").

Assinaturas do acabamento:
- **Traço de tinta visível** com espessura variável e imperfeições de mão;
- **Line boil** (fervilhar de linha): o contorno redesenhado frame a frame
  vibra sutilmente mesmo em poses paradas;
- **Fundos pintados** com textura de papel/aquarela/guache em camadas de
  parallax;
- Personagens integrados aos fundos por luz (rim light da chama), não por
  filtro.

Custo e mitigação (validar na Fase 2):
- Animação frame a frame é o item mais caro do projeto. Plano híbrido a
  testar: personagens jogáveis e bosses frame a frame; inimigos comuns e
  NPCs secundários em rig 2D "disfarçado" com line boil e frames-chave
  redesenhados; VFX em frames desenhados reutilizáveis.
- Ferramentas candidatas: papel+scanner ou desenho digital com pincéis de
  tinta (Procreate/Krita/CSP), composição e limpeza no fluxo do
  `content-pipeline`.

Opções anteriores (registradas como histórico): A. rig 2D vetorial ⭐antiga
recomendação · B. pixel art HD · C. pintado frame a frame — a decisão do
Diretor efetiva uma variação de C com mitigação híbrida.

## Diretrizes de personagem

> 🟢 Sistema completo de design de personagem definido em `../art/` — este
> resumo cede a esses documentos em qualquer detalhe:
> - [`art/CHARACTER_ART_BIBLE.md`](../art/CHARACTER_ART_BIBLE.md) — regra
>   central ("todo ser carrega em seu corpo sinais de sua função, origem e
>   relação com a luz"), linguagem de formas por grupo, materiais, testes de
>   silhueta/cor.
> - [`art/PLAYER_CHARACTER_DESIGN.md`](../art/PLAYER_CHARACTER_DESIGN.md) —
>   os 4 Acendedores, proporções, a chama como expressão, arma (Atiçador).
> - [`art/NPC_AND_BOSS_DESIGN.md`](../art/NPC_AND_BOSS_DESIGN.md) — Pavia,
>   Cri, Dona Fervura, Tio Sebo, Fia & Meada, Bolhinha, bosses, Encinzados.

- Silhueta primeiro: todo personagem legível em preto chapado, a 25% do
  tamanho, ao lado de 3 outros personagens (teste de silhueta).
- Protagonistas: gota de cera + pavio aceso (nunca capuz/chifres/máscara —
  território visual de HK é proibido). Rosto = duas brasas simples.
- Inimigos: insetos estilizados com **um traço de design brasileiro** (cores e
  padrões de fauna tropical estilizada) — diferenciação natural do bestiário
  eurogótico das referências.
- Checklist anti-cópia por asset: silhueta ≠, paleta ≠, pose-chave ≠ de
  qualquer referência direta (revisão registrada).

## VFX e game feel visual

- Hit flash branco 2 frames; partículas de cera derretida como "sangue";
  rastros de luz por cor de jogador; impact frames nos golpes pesados.
- Câmera: micro-shake com limite (toggle acessibilidade), kick direcional.
- Performance: orçamento de partículas por cena; pooling obrigatório.

## Pipeline

- Concept → blockout cinza no LDtk → arte final em camadas → export atlas.
- Aseprite (sprites/efeitos) + Spine ou alternativa livre (rigs) + Krita/PS
  (cenários). Decidir ferramenta de rig na Fase 2 (custo de licença Spine).

## UI

- Diegética onde possível (vida = corações de cera derretendo; Fulgor = a
  própria chama do personagem cresce).
- Fontes: display autoral p/ títulos (a comissionar) + sans legível p/ corpo,
  com suporte pt-BR completo (acentos!) e futura CJK (planejar cedo).

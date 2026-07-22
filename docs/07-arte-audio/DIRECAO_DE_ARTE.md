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

## Estilo de produção (a decidir com testes)

| Opção | Prós | Contras |
|---|---|---|
| **A. Vetorial/recorte animado por esqueleto** (Spine/rig 2D) ⭐ | animação fluida barata, escala em qualquer resolução, blending de animações (padrão Silksong-like moderno), leve p/ web | exige rigs bons p/ não ficar "boneco de papel" |
| B. Pixel art HD | charme, produção previsível | briga com o mercado lotado de pixel metroidvania; fluidez custa muitos frames |
| C. Pintado frame a frame | teto visual altíssimo | custo proibitivo p/ equipe pequena |

Recomendação: **A**, com pintura de cenários em camadas de parallax (2.5 D de
profundidade, estilo Ori simplificado) + partículas generosas.

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

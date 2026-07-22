# Image Prompts — Referência de Geração de Concept Art

> Status: 🟢 Aprovado (base revisada pelo Diretor, 2026-07-22). Prompts em
> inglês (melhor resultado nos geradores atuais) derivados diretamente de
> `CHARACTER_ART_BIBLE.md`, `PLAYER_CHARACTER_DESIGN.md` e
> `NPC_AND_BOSS_DESIGN.md`. Use com qualquer gerador externo (Midjourney,
> etc.) e traga os resultados de volta para comparação com a documentação.
>
> Regra de uso: **todo prompt desta página inclui um negative prompt** —
> nunca gerar sem ele. O objetivo declarado é impedir semelhança acidental
> com Hollow Knight/Silksong e outros metroidvanias de referência (ver
> `01-visao/GAME_REFERENCES.md`).

## Bloco de estilo obrigatório (ADR-010 — acrescentar a TODO prompt)

Estilo "desenhado à mão e digitalizado" (processo tipo Cuphead — nunca o
conteúdo/época de Cuphead). Acrescentar ao final de todo prompt positivo:

```
traditional hand-drawn animation style, drawn on paper and digitized,
visible ink outlines with varying line weight, subtle line boil,
hand-painted watercolor and gouache textured background, paper grain,
vintage traditional animation production quality
```

E acrescentar ao negative prompt de todos:

```
1930s cartoon characters, rubber hose limbs, Cuphead characters, Mugman,
pie-cut eyes, white gloves, vector flat art, pixel art, cel-shaded 3D
```

(Absorvemos o acabamento artesanal sem herdar a identidade de época nem os
personagens do Cuphead.)

---

## Acendedores (protagonistas)

### Base compartilhada (positivo)

Usada em todos os 4 Acendedores — cada um adiciona só as variações abaixo.

```
Small living wax creature designed for an original 2D metroidvania,
three-head-tall proportions, asymmetrical drop-shaped melted wax head,
a real candle wick emerging directly from the top of the head,
small glowing ember eyes, no mask, no horns, no hood, no human clothing,
body made from layered dripping wax resembling a walking candlestick,
holding a short bronze wick-tending tool with a curved bifurcated tip,
strong readable silhouette, expressive flame reacting to emotion,
warm amber rim light contrasting with cold gray fungal darkness,
hand-painted 2D game character concept art, front three-quarter view,
original fantasy creature design, material studies for wax and aged bronze
```

### Base compartilhada (negativo)

```
horned mask, white insect mask, nail sword, rapier, medieval knight,
human child, hooded cloak, skull face, Hollow Knight character, Hornet,
generic candle with stick body, photorealistic, 3D render, anime proportions
```

### Acendedor Âmbar *(equilibrado — personagem de capa)*

Adicionar à base:
```
vertical teardrop-shaped head, symmetrical body, warm amber flame,
warm ivory wax skin tone, simple bronze band around the waist,
compact balanced silhouette
```

### Acendedor Ciano *(mobilidade e precisão)*

Adicionar à base:
```
head tilted slightly backward, slender elongated body,
long trailing wax drips, cool cyan flame, pale blue-white wax skin tone,
small pieces of opaque glass embedded in the shoulders,
tall vertical silhouette
```

### Acendedor Magenta *(energia e ataque)*

Adicionar à base:
```
wider head shape, wick positioned off-center to one side,
asymmetrical wax base, vivid magenta flame,
very pale pink wax skin tone, glowing bright cracks across the body,
silhouette with strong diagonal lines, dynamic attacking pose
```

### Acendedor Verde-lima *(suporte e exploração)*

Adicionar à base:
```
rounder head shape, shorter stockier body,
small side drips resembling stubby limbs, lime-green flame,
beige-green wax skin tone, thin controlled mycelium filaments along one arm,
wide low silhouette
```

---

## NPCs aliados

Cada NPC abaixo é um prompt completo e independente (não usa a base dos
Acendedores — são espécies diferentes). Todos mantêm a linguagem "hand-painted
2D game character concept art, front three-quarter view, original fantasy
creature design" e um negative prompt próprio.

### Pavia, a Cartógrafa Cega

```
An elderly moth-like cartographer creature for an original 2D metroidvania,
hunched curved body, large folded wings draped like a cloak over the back,
tall wooden walking staff, long thin antennae, an irregular mass of rolled
maps strapped to the back, instead of eyes she has three small bronze
sensor discs connected by thin wires attached to her face, worn parchment
wing texture with burnt edges, oxidized bronze fittings, wax cord bindings,
honey-stained maps, hand-painted 2D game character concept art,
front three-quarter view, original fantasy creature design
```
Negativo: `human witch, wizard hat, glasses, goggles, cute anime moth girl, human hands, modern backpack, Hollow Knight character, photorealistic, 3D render`

### Cri, o Duelista

```
A tall slender cricket-like duelist creature for an original 2D metroidvania,
extremely elongated thin body, narrow thorax, angular jointed legs,
short triangular cape, two thin blades that are natural adapted extensions
of the front legs (not held swords), confident theatrical fencing pose,
dark green chitin, polished bronze accents, deep wine-red details,
narrow amber-yellow eyes, hand-painted 2D game character concept art,
front three-quarter view, original fantasy creature design
```
Negativo: `human fencer, rapier held in hand, musketeer hat, anthropomorphic human body, Hollow Knight character, Zote, photorealistic, 3D render`

### Dona Fervura

```
A stocky powerful leafcutter-ant blacksmith creature for an original 2D
metroidvania, wide torso, short thick legs, large muscular arms, a massive
rectangular anvil fused directly into the cracked carapace on her back,
dark bronze anvil with glowing incandescent cracks, small heat pipes running
from the anvil to the arms, hammer marks and small tool hooks on the anvil
surface, reddish-brown chitin, burnt bronze color palette, black leather
apron, intense orange forge light, steam venting from body joints,
hand-painted 2D game character concept art, front three-quarter view,
original fantasy creature design
```
Negativo: `human blacksmith, dwarf, medieval armor, muscular human body, Hollow Knight character, photorealistic, 3D render`

### Tio Sebo

```
A small traveling snail-merchant creature for an original 2D metroidvania,
tiny soft body, enormous spiral shell that glows warmly from within like a
lit shop interior, dozens of small items dangling from hooks all around the
shell, tiny nooks drawers pots lamps and signs visible inside the spiral,
a small retractable awning cover, olive green and tallow brown color
palette, amber and colored glass accents, aged bronze fittings, cluttered
but purposeful arrangement, hand-painted 2D game character concept art,
front three-quarter view, original fantasy creature design
```
Negativo: `human merchant, cute pixar snail, humanoid body, backpack instead of shell, Hollow Knight character, photorealistic, 3D render`

### Fia & Meada *(dupla — um único prompt para a composição conjunta)*

```
Twin spider-like weaver creatures for an original 2D metroidvania, standing
side by side, golden silk threads functioning as hair, clothing and tools,
one twin (Fia) has closed eyes, relaxed slouched posture, loose warm-toned
threads and slow dreamy poses, the other twin (Meada) has wide open eyes,
upright rigid posture, tightly organized cool-toned threads and fast alert
poses, their combined silhouette and web patterns forming a subtle infinity
or hourglass shape between them, golden silk threads with geometric woven
patterns, hand-painted 2D game character concept art, front three-quarter
view, original fantasy creature design
```
Negativo: `human twins, cute anime spider girls, Hollow Knight character, photorealistic, 3D render`

### Bolhinha

```
A tiny round firefly mascot creature for an original 2D metroidvania,
nearly spherical soft body, wings too small for its round body, large
non-human glowing eyes, tiny stubby legs, a disproportionately large
luminous glowing tail, curved short antennae, pale yellow and cream color
palette with warm amber glow and small cyan light spots, extremely simple
huggable silhouette suitable for a mascot or plush toy, hand-painted 2D
game character concept art, front three-quarter view, original fantasy
creature design
```
Negativo: `realistic insect, human fairy, Navi, Hollow Knight character, photorealistic, 3D render`

---

## Bosses

### Regente Oca *(1ª fase — dourada)*

```
A large bee-queen automaton boss creature for an original 2D metroidvania,
bee-shaped body fused with rigid mechanical automaton parts, abdomen made
of stacked bronze rings, large ornate hexagonal crown made of honeycomb
that slowly rotates, rigid glass wings, thin mechanical legs, smooth waxy
face plate with no mouth, three glowing slits for eyes, a central crack
with dark honey slowly leaking, golden and bronze color palette,
hand-painted 2D game boss concept art, dramatic front three-quarter view,
original fantasy boss design
```
Negativo: `human queen, robot, humanoid mecha, Hollow Knight character, photorealistic, 3D render`

### Pavio-Rei *(1ª forma — o trono de sebo)*

```
A colossal boss creature made of ancient melted wax for an original 2D
metroidvania, mountain-like mass of dripping wax, many incomplete
half-formed arms, several barely-formed faces embedded in the wax surface,
extinguished wick stubs scattered across the body, black root-like
tendrils piercing through the mass, ancient objects and relics embedded
and half-absorbed into the wax, oppressive dark scale, dim residual amber
glow beneath a layer of ash-gray corruption, hand-painted 2D game boss
concept art, dramatic wide front three-quarter view, original fantasy
boss design
```
Negativo: `human giant, lava monster, generic ooze slime, Hollow Knight character, photorealistic, 3D render`

---

## Notas de uso

- Ao trazer os resultados de volta: informe qual bloco (Acendedor/NPC/boss)
  cada imagem representa, para eu comparar com `CHARACTER_ART_BIBLE.md` e
  registrar aprovações/ajustes nesta pasta.
- Se um resultado ficar bom mas próximo demais de uma referência protegida,
  reforce o negative prompt específico daquela referência (ex.: adicionar o
  nome do jogo/personagem que apareceu por engano) e regenere.
- View adicional recomendada para produção: repetir o mesmo prompt trocando
  `front three-quarter view` por `side view` e `back view`, conforme o
  padrão de concept art de `CHARACTER_ART_BIBLE.md` (vista frontal, lateral,
  traseira, três expressões, cinco poses).

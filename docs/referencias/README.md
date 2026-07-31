# Referências visuais (só inspiração — nunca conteúdo)

Esta pasta guarda imagens de **referência externa** usadas para inspirar
mecânica, estrutura e qualidade de produção — nunca para copiar conteúdo,
nomes, personagens ou arte. Mesma regra de sempre (ver `CLAUDE.md`, seção
"IP 100% original" e `docs/01-visao/GAME_REFERENCES.md`).

## `mapas/silksong-mapa-mundo-referencia.png`

Mapa-múndi completo de *Hollow Knight: Silksong* (fan-rendered, encaminhado
pelo Diretor em 2026-07-31). Usado como referência para:

1. **Formato orgânico das áreas no mapa in-game** — cada região é desenhada
   com o contorno real do seu terreno (implementado em `prototype/js/map.js`
   desde a v3.3), não formas quadradas/retangulares genéricas.
2. **Uma paleta de cor distinta por região**, refletindo o ambiente
   predominante daquele bioma — regra formalizada em `CLAUDE.md` (seção
   "Paleta de cor por região") e já em uso desde o protótipo v1 (`theme` por
   região em `prototype/js/world.js`).
3. **Inspiração para as próximas áreas do mundo de Névora** (ainda não
   implementadas) — a extensão do grafo de regiões além das 8 atuais deve
   seguir o mesmo espírito de diversidade de bioma + paleta própria que esse
   mapa de referência demonstra. Nomes, biomas e conteúdo de Névora
   continuam 100% originais; só a *abordagem visual/estrutural* é inspirada
   nessa referência.

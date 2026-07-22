# Character Art Bible — Sistema de Design de Névora

> Status: 🟢 Aprovado (diretriz do Diretor, 2026-07-22). Este documento é a
> **fonte da verdade** do sistema visual de personagens de Névora. Os
> documentos `PLAYER_CHARACTER_DESIGN.md` e `NPC_AND_BOSS_DESIGN.md` aplicam
> estas regras a cada elenco específico — nenhum personagem novo entra no
> jogo sem seguir este sistema.

## A regra visual central

> **Em Névora, todo ser carrega em seu corpo sinais de sua função, origem e
> relação com a luz.**

Isso significa que silhueta, material e comportamento com a luz **não são
decoração** — são a linguagem que o jogador usa para entender o mundo antes
de qualquer texto. Um personagem bem desenhado em Névora deve ser legível
mesmo sem HUD, sem nome, sem diálogo.

## Por que isso existe

O objetivo é que os personagens não pareçam ideias isoladas desenhadas uma a
uma, mas **integrantes do mesmo universo**. Um sistema de design consistente
— não uma lista de personagens bonitos — é o que dá a Névora identidade
reconhecível numa única imagem.

---

## Linguagem de formas por grupo

Cada grupo de personagens tem uma "gramática" de formas própria. Isso permite
que o jogador reconheça **instantaneamente o tipo de personagem**, mesmo sem
detalhes internos — puramente pela silhueta.

| Grupo | Linguagem de formas |
|---|---|
| **Acendedores** (jogadores) | formas arredondadas, gotas, curvas e triângulos suaves |
| **NPCs aliados** | formas orgânicas e assimétricas |
| **Autômatos** | hexágonos, círculos mecânicos e linhas rígidas |
| **Encinzados** (inimigos corrompidos) | silhuetas quebradas, pontas irregulares, massas de fungo |
| **Chefes** | mistura exagerada de **duas linguagens visuais incompatíveis** (ex.: autômato + orgânico corrompido — ver Regente Oca; ou Acendedor + massa colossal — ver Pavio-Rei) |

A regra dos chefes é deliberada: a incoerência visual entre duas linguagens é
o que sinaliza "isto é anormal, isto é perigoso, isto quebrou uma categoria".

---

## Materiais predominantes

Os personagens de Névora devem ser construídos visualmente com **poucos
materiais principais**, sempre os mesmos, recombinados:

- cera
- bronze envelhecido
- quitina
- vidro
- tecido queimado
- mel cristalizado
- micélio
- pergaminho
- madeira carbonizada

### Evitar

- aço polido
- armaduras medievais convencionais
- roupas humanas modernas

Esses materiais quebram a identidade do mundo (que não é medieval-humano nem
sci-fi) e devem ser recusados em qualquer concept, mesmo como referência
temporária.

---

## Critérios técnicos para os sprites

Névora é um jogo **multiplayer com até 4 personagens simultâneos em tela**,
frequentemente em ambientes carregados de partículas e luz. Todo personagem
precisa sobreviver a esse teste antes de ser aprovado.

### Teste de silhueta

Todo personagem deve ser reconhecível:
- completamente preto (sem textura, sem iluminação);
- a 25% do tamanho original;
- durante movimento;
- ao lado de três outros personagens.

Se dois personagens ficam confundíveis nesse teste, o design volta para
revisão — não é opcional.

### Teste de cor

Cada Acendedor deve continuar identificável em:
- áreas âmbar;
- áreas azuis;
- neve;
- escuridão;
- efeitos de chefe;
- **modo para pessoas com daltonismo**.

Além da cor, cada Acendedor precisa se diferenciar por:
- formato da chama;
- partícula;
- ícone;
- silhueta;
- padrão de pulso luminoso.

(A cor nunca é a única variável de leitura — ver a regra de multiplayer em
`PLAYER_CHARACTER_DESIGN.md`.)

---

## Tamanho de produção sugerido

### Para concept art
- canvas de 2048 × 2048;
- vista frontal;
- vista lateral;
- vista traseira;
- três expressões;
- cinco poses;
- materiais destacados (folha de material separada);
- paleta separada (swatches).

### Para sprite final
O tamanho depende da câmera final do jogo (ver `06-tecnologia/ARQUITETURA.md`),
mas o ponto de partida de teste é:
- personagem entre 96 e 160 pixels de altura;
- animação trabalhada em alta resolução, com redução controlada no motor;
- contorno e iluminação **separados** do sprite-base (permite tingir a luz da
  chama por cor de jogador sem redesenhar o personagem — requisito técnico
  direto do multiplayer).

---

## Estrutura dos documentos de arte de personagem

- **`CHARACTER_ART_BIBLE.md`** *(este arquivo)* — sistema geral: regra
  central, linguagem de formas, materiais, critérios técnicos.
- **[`PLAYER_CHARACTER_DESIGN.md`](./PLAYER_CHARACTER_DESIGN.md)** — os
  Acendedores (protagonistas): proporções, cabeça, rosto, a chama como
  expressão, corpo, os 4 Acendedores, regra de cor no multiplayer, arma
  (Atiçador), customização.
- **[`NPC_AND_BOSS_DESIGN.md`](./NPC_AND_BOSS_DESIGN.md)** — Pavia, Cri, Dona
  Fervura, Tio Sebo, Fia & Meada, Bolhinha, Regente Oca, Pavio-Rei,
  Encinzados.

Todo personagem novo proposto por qualquer agente (Narrativa, Mundo, Arte)
deve declarar, antes de qualquer arte: **grupo de linguagem de formas**,
**materiais usados** e **como passa no teste de silhueta**.

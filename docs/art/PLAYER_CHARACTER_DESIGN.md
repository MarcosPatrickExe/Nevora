# Player Character Design — Os Acendedores

> Status: 🟢 Aprovado (diretriz do Diretor, 2026-07-22). Aplica o sistema de
> `CHARACTER_ART_BIBLE.md` aos protagonistas. Substitui/detalha as descrições
> gerais de Acendedores em `02-narrativa/PERSONAGENS.md`.

Os protagonistas precisam ser **simples, reconhecíveis e altamente
animáveis** — eles carregam o jogo inteiro na tela, em grupos de até 4, por
dezenas de horas.

## Proporções (base)

| Parte | Proporção |
|---|---|
| Cabeça | ~40% da altura |
| Tronco | ~35% |
| Pernas e base de cera | ~25% |
| Braços | curtos e finos |
| Mãos | simplificadas, 2–3 dedos |
| Altura visual total | equivalente a três cabeças |

O corpo deve ser **pequeno, mas não excessivamente infantil**.

## Cabeça

A cabeça deve lembrar uma **gota de cera parcialmente derretida**:
- topo afunilado;
- pavio inserido diretamente na cera;
- uma lateral mais escorrida que a outra (assimetria natural, nunca
  perfeitamente simétrica);
- pequenas deformações variam entre personagens (identidade individual);
- olhos posicionados na metade inferior da cabeça.

⚠️ **A forma não deve lembrar um capacete, máscara ou crânio.** Este é um
critério de rejeição direto em revisão de concept.

## Rosto

O rosto é **extremamente econômico**:
- dois olhos de brasa;
- sem nariz;
- sem sobrancelhas convencionais;
- boca ausente ou representada por uma fenda discreta.

### Expressividade sem rosto expressivo

Toda emoção vem de **fora do rosto**:
- inclinação da cabeça;
- distância entre os olhos;
- intensidade da brasa;
- direção da chama;
- velocidade do derretimento;
- contração do corpo.

---

## A chama como expressão

A chama é o **principal elemento emocional e funcional** do personagem — o
verdadeiro "rosto" do Acendedor. Cada estado de jogo tem uma assinatura de
chama própria:

| Estado | Assinatura visual |
|---|---|
| **Neutro** | chama curta; movimento suave; iluminação constante |
| **Energia cheia** (Fulgor alto) | chama alta; núcleo branco; partículas pequenas; postura mais ereta |
| **Vida baixa** | chama instável; oscilações laterais; pequenas falhas; fumaça fina; corpo mais curvado |
| **Medo / presença de chefe** | chama inclinada para trás; corpo encolhido; olhos mais próximos; cera tremendo |
| **Fulgor máximo** | chama duplicada ou alongada; contorno luminoso; gotas de cera subindo por efeito sobrenatural; partículas circulando o pavio |

Essa tabela é normativa para animação: qualquer novo estado de jogador
(buff, debuff, item ativo) deve primeiro perguntar "o que a chama faz aqui?"

---

## Corpo

A roupa **não é roupa convencional** — o próprio corpo forma uma espécie de
vestimenta:
- camadas de cera endurecida;
- bordas escorridas;
- placas naturais sobrepostas;
- cintura formada por um anel de cera;
- pequenas marcas de uso e rachaduras.

O corpo deve parecer **simultaneamente**: criatura · vela · castiçal ·
aventureiro. Se um desses quatro aspectos desaparecer, o design perdeu a
identidade de Névora.

---

## Os quatro Acendedores

Para o multiplayer, **não usamos quatro cópias idênticas com troca de cor.**
Cada jogador tem uma silhueta própria — mas todos compartilham o mesmo
esqueleto de animação (requisito técnico: rigs compatíveis, ver
`06-tecnologia/ARQUITETURA.md`).

### Acendedor Âmbar
- **Papel visual:** equilibrado, mais próximo da identidade principal do
  jogo — é o personagem de capa e materiais promocionais.
- Cabeça em gota vertical; corpo simétrico; chama âmbar; cera marfim quente;
  faixa simples de bronze; silhueta compacta.

### Acendedor Ciano
- **Papel visual:** mobilidade e precisão.
- Cabeça levemente inclinada para trás; corpo mais fino; escorridos longos;
  chama ciano; cera branco-azulada; pequenas peças de vidro opaco; silhueta
  mais vertical.

### Acendedor Magenta
- **Papel visual:** energia, impulsividade e ataque.
- Cabeça mais larga; pavio deslocado para uma lateral; base de cera
  assimétrica; chama magenta; cera rosada muito pálida; rachaduras
  brilhantes; silhueta com diagonais mais fortes.

### Acendedor Verde-lima
- **Papel visual:** suporte, exploração e interação com fungos.
- Cabeça mais arredondada; corpo mais baixo; gotas laterais; chama
  verde-lima; cera bege-esverdeada; pequenos filamentos de micélio
  controlado; silhueta mais larga.

---

## Regra importante de multiplayer: a cor não pode depender só da chama

A cor do jogador precisa estar reforçada em **múltiplos canais** simultâneos,
porque a chama sozinha pode ficar ilegível em telas cheias de efeito:

- borda luminosa;
- partículas;
- cursor;
- ícone do HUD;
- marca no chão durante ações cooperativas;
- indicador de reviver;
- efeito do ataque;
- nome sobre o personagem, quando necessário.

Isso garante leitura mesmo em áreas muito claras, biomas de neve, ou em meio
a efeitos de chefe — e é a base do requisito de acessibilidade cromática do
teste de cor (`CHARACTER_ART_BIBLE.md`).

---

## Arma dos Acendedores: o **Atiçador**

> Substitui o nome provisório "Ferrão de Cera" em toda a documentação
> (`04-gameplay/ARMAS_E_FERRAMENTAS.md`, `00-processo/GLOSSARIO.md`,
> `02-narrativa/ENREDO.md`). Ver ADR-008 em `00-processo/DECISOES.md`.

A arma inicial não podia parecer uma versão disfarçada do "ferrão"/"prego" de
outros metroidvanias. A solução é transformá-la num **utensílio de
acendimento** — coerente com a profissão dos Acendedores, não uma arma de
guerra importada de outro gênero.

O **Atiçador** é uma ferramenta curta de bronze, usada originalmente para:
- manipular pavios;
- cortar cera;
- acender mecanismos;
- abrir lacres;
- perfurar quitina.

**Visual:**
- cabo de madeira carbonizada;
- pequena lâmina curva;
- ponta bifurcada;
- reservatório de Fulgor no centro;
- comprimento semelhante ao antebraço do personagem.

Nomes alternativos avaliados e descartados: Agulha de Pavio, Incisor,
Fagulheiro, Corta-Pavio, Cinzel de Brasa, Espeto de Luz. **Atiçador** foi
escolhido por ser o mais original e coerente com a identidade de "utensílio
de ofício" que já define as demais armas do jogo (ver
`04-gameplay/ARMAS_E_FERRAMENTAS.md`).

---

## Customização dos jogadores

A customização deve ser **pequena e controlada**, para preservar a
identidade visual do sistema.

### O jogador pode alterar
- formato da chama;
- marca no rosto;
- pequenos pingentes;
- padrão das rachaduras;
- formato da barra de cera no corpo;
- cor secundária;
- adorno do pavio;
- efeito de partículas.

### Evitar sempre
- chapéus grandes;
- armaduras completas;
- fantasias cômicas;
- itens que escondam a chama;
- roupas que quebrem a silhueta original.

Qualquer item cosmético proposto passa pelo teste de silhueta da
`CHARACTER_ART_BIBLE.md` antes de ser aprovado.

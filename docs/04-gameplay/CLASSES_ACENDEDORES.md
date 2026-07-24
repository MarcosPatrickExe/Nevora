# Sistema de Classes — Os Seis Acendedores
> Documento de game design — Névora · destino sugerido: `docs/04-gameplay/CLASSES_ACENDEDORES.md`
> Status: 🟡 Proposta (gera ADR-014 se aprovada)
> Relacionado: `docs/art/ACENDEDORES_REDESIGN.md` (Etapa 3), ADR-005 (co-op 2–4), ADR-008 (Atiçador), proposta ADR-013 (Fulgores/Fagulhas)
> ⚠️ **Conflito de nome em aberto:** este documento usa "Fulgor" no sentido de
> *vida* (proposta ADR-013). A documentação atual já usa "Fulgor" para o
> **recurso de mana/energia** (`00-processo/GLOSSARIO.md`,
> `04-gameplay/GAMEPLAY_CORE.md`). Os dois sentidos não podem coexistir —
> ver aviso completo em `00-processo/DECISOES.md` (ADR-013). Não implementar
> até o Diretor resolver o nome.

---

## 1. Regras do sistema

1. **Uma classe por save.** A escolha é feita na criação do save e é permanente naquele arquivo. Rejogar com outra classe = novo save. Objetivo explícito: **rejogabilidade** — cada classe altera mecânica, habilidades exclusivas e técnicas exclusivas, mudando como o mapa é lido e o combate é resolvido.
2. **O que a classe define:** 1 passiva permanente, 2 habilidades ativas exclusivas, 1 técnica exclusiva (movimento/ação avançada destravável no mid-game) e o item da mão esquerda.
3. **O que a classe NÃO define:** armas (mão direita continua 100% intercambiável — ADR 008), Fulgores (todas começam com 5), acesso a regiões (nenhuma área é exclusiva de classe; classes mudam o *como*, não o *se*).
4. **Co-op:** classes podem se repetir na sessão (dois jogadores da mesma classe é permitido), mas o matchmaking/lobby destaca composições variadas mostrando as sinergias.
5. **Identidade visual** segue o corpo-base de vela + linguagem de formas do brief; cor de chama = identificador de classe.

---

## 2. As seis classes

### 2.1 VIANDANTE (equilibrado) — chama âmbar — personagem: Breo
- **Fantasia:** o viajante que abre caminho; a classe "aprenda o jogo com ela".
- **Passiva — Passo Firme:** não sofre knockback de dano leve; recupera 1 Fagulha extra por inimigo morto próximo (incentiva combate corpo a corpo).
- **Ativa 1 — Clarão:** ergue a lanterna e revela por 4s inimigos e itens ocultos num raio médio.
- **Ativa 2 — Golpe Atiçado:** próximo golpe da arma equipada ganha +50% de dano e acende inimigos (dano ao longo do tempo).
- **Técnica exclusiva — Marcha do Farol:** ao ficar parado 1s, cria zona de luz que cura lentamente aliados dentro dela (1 Fulgor a cada 20s, consome Fagulhas).
- **Sinergia co-op:** âncora do grupo; a zona de luz é ponto de reagrupamento.

### 2.2 BATEDORA (ágil) — chama ciano — personagem: Sílice
- **Fantasia:** velocidade e descoberta; a classe do speedrunner e do explorador.
- **Passiva — Faro de Brasa:** a bússola vibra/aponta quando há segredo (Fulgor grátis, sala oculta) na sala atual — reforça a economia "explorar em vez de farmar".
- **Ativa 1 — Dash de Pavio:** dash com i-frames curtos que atravessa inimigos pequenos e deixa rastro que causa dano.
- **Ativa 2 — Estilhaço:** arremessa fragmento de vidro que ricocheteia em 2 paredes.
- **Técnica exclusiva — Passo Duplo:** segundo pulo aéreo (exclusivo — nenhuma outra classe tem pulo duplo).
- **Sinergia co-op:** abre rotas, marca segredos no mapa compartilhado para o grupo.

### 2.3 VIGIA (defensivo) — chama vermelho-brasa — personagem novo: "BRASME" (nome provisório)
- **Fantasia:** o escudo do grupo; corpo largo, placas de bronze, chama protegida atrás de visor metálico (linguagem de formas "defensivo" do brief).
- **Passiva — Cera Endurecida:** dano frontal recebido é reduzido; ao perder um Fulgor, solta onda curta que empurra inimigos.
- **Ativa 1 — Muralha de Sebo:** ergue parede de cera temporária que bloqueia projéteis e vira plataforma escalável.
- **Ativa 2 — Provocação do Sino:** toca o sino da mão esquerda; inimigos próximos focam nele por 3s.
- **Técnica exclusiva — Postura de Farol:** imóvel, vira "torre": reflete projéteis e aliados podem pular sobre ele como plataforma.
- **Sinergia co-op:** tanque clássico + utilidade de plataforma viva para puzzles cooperativos.
- **Item mão esquerda:** sino de bronze.

### 2.4 RITUALISTA (arcano) — chama magenta — personagem: Véspera
- **Fantasia:** controle de área e suporte; lê o mundo pelos faróis mortos.
- **Passiva — Memória Acesa:** ao morrer, deixa "eco de chama" no local por 60s; se voltar (ou um aliado tocar), recupera metade das Fagulhas perdidas.
- **Ativa 1 — Círculo de Fumaça:** área que desacelera inimigos e amplifica dano recebido por eles.
- **Ativa 2 — Chama Emprestada:** transfere 1 Fulgor seu para um aliado (co-op) ou converte 1 Fulgor em rajada mágica (solo).
- **Técnica exclusiva — Véu de Véspera:** invisibilidade de 3s para inimigos não-alertados (stealth exclusivo da classe).
- **Sinergia co-op:** única classe que transfere vida; muda completamente a economia de Fulgores em grupo.

### 2.5 COLETOR (alquimista) — chama verde-lima — personagem: Turfo
- **Fantasia:** recursos, preparação e guerra química contra o fungo.
- **Passiva — Olho de Mercador:** inimigos dropam +25% Fagulhas; frascos coletados no cenário rendem ingrediente extra.
- **Ativa 1 — Frasco de Esporos:** granada de área que causa dano contínuo e marca inimigos.
- **Ativa 2 — Luz Fria:** alterna a iluminação para o frasco-lanterna de fungo: não atrai inimigos sensíveis à chama (stealth ambiental).
- **Técnica exclusiva — Alquimia de Campo:** único que cria consumíveis (bombas, óleo de arma, isca) em bancadas espalhadas pelo mapa.
- **Sinergia co-op:** economia do grupo — abastece aliados de consumíveis; o farm de Fagulhas rende mais com ele na sessão.

### 2.6 FUNILEIRO (mecânico) — chama azul-petróleo — personagem novo: "PARAFINO" (nome provisório)
- **Fantasia:** engenhoca, bronze e vapor; corpo remendado com placas, válvulas e marcas de fuligem (linguagem de formas "mecânico" do brief).
- **Passiva — Manutenção:** armas equipadas ganham efeito secundário mecânico (ex.: Atiçador solta fagulhas em arco); interage mais rápido com máquinas/elevadores/portas de engrenagem.
- **Ativa 1 — Autômato-Vaga-lume:** implanta mini-torreta de bronze que atira brasas por 8s.
- **Ativa 2 — Jato de Pressão:** rajada de vapor que empurra inimigos e o impulsiona na direção oposta (mobilidade ofensiva).
- **Técnica exclusiva — Gancho de Corda:** gancho retrátil que puxa o personagem a pontos de ancoragem (travessia exclusiva).
- **Sinergia co-op:** torreta segura corredores; o gancho + Muralha do Vigia criam rotas alternativas em dupla.
- **Item mão esquerda:** chave-ferramenta multiuso.

---

## 3. Matriz de rejogabilidade (por que jogar de novo)

| Classe | Muda o combate | Muda a exploração | Muda a economia |
|---|---|---|---|
| Viandante | corpo a corpo agressivo | revela ocultos | +Fagulha por kill próximo |
| Batedora | hit-and-run | pulo duplo + faro de segredos | acha Fulgores grátis |
| Vigia | tank/reflexão | vira plataforma | — |
| Ritualista | controle de área | stealth mágico | eco recupera Fagulhas |
| Coletor | dano contínuo/química | luz fria (stealth ambiental) | +25% Fagulhas, consumíveis |
| Funileiro | torreta + vapor | gancho de corda | interação com máquinas |

Cada classe tem ao menos **uma forma exclusiva de travessia ou percepção** (revelar, pulo duplo, plataforma, stealth, luz fria, gancho) → salas opcionais podem oferecer atalhos diferentes por classe **sem nunca bloquear conteúdo obrigatório** (regra 3).

---

## 4. Impactos e pendências

1. **Arte:** duas fichas novas (Brasme e Parafino) precisam ser criadas no padrão da Etapa 3 (24 itens); as linguagens de forma "defensivo" e "mecânico" do brief já dão a base.
2. **Cores de chama:** o brief listava 4 cores; este sistema adiciona vermelho-brasa e azul-petróleo. Precisa de aprovação como emenda ao brief de arte.
3. **Balanceamento:** valores (durações, %s, custos) são placeholder para o protótipo v2 — calibrar em playtest.
4. **Protótipo v2:** implementar primeiro a seleção de classe no save + 1 passiva e 1 ativa por classe (fatia vertical); técnicas exclusivas ficam para v3.
5. **ADR-014 proposto:** "Sistema de 6 classes de Acendedores, 1 por save, com passiva + 2 ativas + 1 técnica exclusiva por classe; armas permanecem universais."

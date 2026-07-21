# Agentes de Desenvolvimento e Setores

> Status: 🟡 Proposta. Define os "agentes" (papéis especializados de IA +
> humano no comando) e o setor de cada um. Na prática: cada agente é um
> contexto de trabalho com responsabilidades, documentos que possui ("dono
> de"), e critérios de aceite claros.

## Organograma

```
                         🧑‍✈️ DIRETOR (você — decisão final em tudo)
                                        │
        ┌──────────────┬────────────────┼────────────────┬──────────────┐
   🎬 Agente        🗡️ Agente       🌍 Agente        🎨 Agente      🔧 Agente
   NARRATIVA        GAMEPLAY        MUNDO/LEVEL      ARTE & ÁUDIO   ENGENHARIA
        │                │                │                │              │
        │           ⚔️ sub: Combate   🗺️ sub: Level      🎵 sub: Áudio  🌐 sub: Netcode
        │           📈 sub: Balance   🐜 sub: Bestiário                 📱 sub: PWA/Plataformas
        └────────────────────┬─────────────────────────────┬────────────┘
                        🧪 Agente QA                  🚀 Agente DEVOPS/PUBLICAÇÃO
                             └──────────── 📋 Agente PRODUTOR (roadmap, escopo, atas)
```

## Fichas dos agentes

### 📋 Produtor *(setor: gestão)*
- **Faz:** roadmap, cortes de escopo, atas de decisão (ADR), backlog, riscos.
- **Dono de:** `README.md`, `00-processo/`, `09-roadmap/`.
- **Critério:** nenhuma tarefa sem fase, dono e critério de aceite.

### 🎬 Narrativa *(setor: história e texto)*
- **Faz:** enredo, lore, diálogos, fichas de personagem, nomes (com checagem
  de colisão de IP), localização pt/en.
- **Dono de:** `02-narrativa/`.
- **Critério:** originalidade auditada; tom "aventura primeiro".

### 🗡️ Gameplay *(setor: mecânicas e sistemas)*
- **Faz:** movimentação, combate, armas, Selos, progressão, economia.
- **Subagentes:** *Combate* (frame data, feel), *Balanceamento* (planilhas,
  curvas, simulações).
- **Dono de:** `04-gameplay/`.
- **Critério:** toda mecânica declara comportamento em 1/2/3/4 jogadores.

### 🌍 Mundo & Level Design *(setor: mapa e conteúdo)*
- **Faz:** biomas, grafo de progressão, salas (LDtk), segredos, bestiário por
  região, colocação de itens.
- **Subagentes:** *Level* (salas), *Bestiário* (inimigos/IA em dados).
- **Dono de:** `03-mundo/`, futuros `bosses/*.md` e fichas de inimigos.
- **Critério:** métricas de MAPA.md (atalhos, distância de lampião etc.).

### 🎨 Arte & Áudio *(setor: estética)*
- **Faz:** direção de arte, concepts, rigs, VFX, UI, trilha, SFX.
- **Dono de:** `07-arte-audio/`.
- **Critério:** checklist anti-cópia por asset; orçamentos de performance.

### 🔧 Engenharia *(setor: código)*
- **Faz:** engine (`sim`), render, input, ferramentas, pipeline de assets.
- **Subagentes:** *Netcode* (`05-multiplayer/NETCODE.md`), *Plataformas/PWA*
  (`06-tecnologia/PWA.md`, futuros wrappers Steam/mobile).
- **Dono de:** `06-tecnologia/`, código-fonte.
- **Critério:** sim sem dependência de render; testes verdes; orçamentos de
  bundle/fps respeitados.

### 🧪 QA *(setor: qualidade)*
- **Faz:** planos de teste, testes de regressão da sim (replays), playtests
  guiados, triagem de bugs, testes de latência.
- **Dono de:** futura pasta `10-qa/`.
- **Critério:** nenhum boss aprovado sem teste em 1–4 jogadores e 3 faixas de
  latência.

### 🚀 DevOps & Publicação *(setor: infra e lojas)*
- **Faz:** CI/CD, hosting, monitoração de salas, builds de loja, requisitos de
  certificação, page da Steam, LGPD/GDPR.
- **Dono de:** `08-publicacao/`, infraestrutura.

## Protocolo de trabalho entre agentes

1. **Fonte da verdade = `docs/`.** Agente algum inventa regra fora dos docs;
   mudança de regra → PR no doc + entrada em `DECISOES.md`.
2. **Handoffs explícitos:** ex. Gameplay especifica arma → Arte gera concept →
   Engenharia implementa de dados → QA valida com replay.
3. **Tudo data-driven** para que agentes de conteúdo não toquem em engine.
4. **O Diretor (humano) aprova:** mudanças de escopo, cânone narrativo,
   decisões de stack e qualquer gasto.

## Ordem de ativação dos agentes por fase (resumo)

| Fase | Agentes ativos |
|---|---|
| 0 Planejamento | Produtor, Narrativa, Gameplay, Mundo (todos em modo doc) |
| 1 Protótipo feel | Engenharia + Gameplay/Combate |
| 2 Vertical slice | + Arte & Áudio, Level |
| 3 Multiplayer alpha | + Netcode, QA |
| 4+ Produção | todos |

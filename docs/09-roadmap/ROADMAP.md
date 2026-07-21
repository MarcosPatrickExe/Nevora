# Roadmap do Projeto

> Status: 🟡 Proposta. Sem datas — fases com **critérios de saída** (uma fase
> só termina quando os critérios são cumpridos). Estimativas em "semanas de
> trabalho" são ordens de grandeza para conversa, não promessas.

## Fase 0 — Pré-produção (AGORA) 📍
**Objetivo:** especificar o jogo inteiro em `docs/` antes de qualquer código.
- [x] Estrutura de documentação criada
- [ ] Discussão e revisão de todos os docs 🟡 → 🟢 (com o Diretor)
- [x] ADR-002 stack · ADR-004 nome (Névora) · ADR-005 jogadores · ADR-006
      câmera · ADR-007 escopo (18 regiões) — **fechadas em 2026-07-21**
- [ ] ADR-003: repositório definitivo criado e docs migradas
- [ ] Fichas detalhadas: 8 bosses, ~60 inimigos, 30 Selos (templates prontos)
- [ ] Concepts de arte: protagonista, 1 inimigo, 1 tela do Vale (definir estilo)
- **Sai quando:** Diretor aprova escopo v1.0 e stack. *(~3–6 semanas)*

## Fase 1 — Protótipo de Game Feel ("o boneco gostoso")
**Objetivo:** provar movimentação e combate numa sala cinza. Solo, sem arte.
- Corrida/pulo/dash/pogo/parry com feel nível referência; 3 inimigos de teste;
  overlay de debug; replay system básico.
- **Sai quando:** 10 min de gameplay greybox "viciante" aprovados em vídeo +
  controles validados com gamepad/teclado/touch. *(~4–8 semanas)*
- ☠️ **Gate de morte:** se o feel não convencer, paramos e reavaliamos stack
  (ADR) — nada mais importa enquanto isso.

## Fase 2 — Vertical Slice (1 bioma real)
**Objetivo:** Vale das Velas + vila mínima + Besouro Sineiro com arte e áudio
finais — o jogo "de verdade" em miniatura, ainda solo.
- Pipeline completo funcionando (LDtk→jogo, Aseprite→atlas, áudio adaptativo).
- Benchmark mobile/iOS WebView (decisão de risco de publicação).
- **Sai quando:** slice jogável do despertar até o farol aceso (~45 min),
  60 fps no device de referência. *(~10–16 semanas)*

## Fase 3 — Alpha Multiplayer
**Objetivo:** o slice da Fase 2 jogável em co-op 2–4 online.
- Servidor de salas, predição/reconciliação, revive, câmera independente,
  ping da Bolhinha, testes de latência 100–300 ms.
- **Sai quando:** 2 pessoas em redes reais diferentes zeram o slice juntas
  "sentindo solo". Decisões de netcode viram ADR. *(~8–14 semanas)*

## Fase 4 — Produção de Conteúdo *(a fase mais longa — 18 regiões, ADR-007)*
**Objetivo:** fabricar as 17 regiões restantes + bosses no pipeline provado.
- Ritmo estimado por porte: região **G** 5–8 semanas · **M** 3–4 · **P** 1–2
  (paralelizável com agentes; pipeline data-driven é o multiplicador).
- Ordem de produção = ordem de camadas: Superfície/Copas → Médio → Alturas →
  Profundezas (o jogo fica zerável em fatias crescentes).
- Marcos internos: "Ato 1 completo" → "5 faróis" → "Profundezas abertas" →
  "content complete".
- Beta fechada com comunidade (Discord) a partir de "Ato 1 completo".
- **Contingência "Atos gratuitos" (ADR-007):** se o ritmo real inviabilizar as
  18 regiões num prazo saudável, a v1.0 pode lançar com Superfície+Médio+
  Alturas completos (campanha até a Regente Oca) e as Profundezas chegarem em
  updates gratuitos que completam a história. Decidir apenas com dados reais
  de produção — nunca cortar qualidade de região para caber no prazo.
- **Sai quando:** content complete — jogo zerável do início aos 3 finais.

## Fase 5 — Polimento e Beta
**Objetivo:** balanceamento, acessibilidade, performance, localização en,
juice final, correção em massa. Beta aberta limitada na web (marketing).
- **Sai quando:** crash-free ≥ 99,5%, funil da demo saudável, aprovação final.

## Fase 6 — Lançamento Web + PWA 🚀
- Infra de salas em produção (3 regiões), landing, presskit, demo co-op.
- Pós-lançamento imediato: hotfixes, telemetria, custo de servidor.

## Fase 7 — Ports (Steam → Epic → mobile lojas)
- Conforme `08-publicacao/PUBLICACAO.md` (wrapper desktop, Steamworks,
  Capacitor/TWA, certificações, ratings).
- Em paralelo: conteúdo pós-lançamento (NG+, boss rush, bioma 10?).

---

## Riscos gerais do projeto (top 5)

| # | Risco | Mitigação |
|---|---|---|
| 1 | Escopo grande (18 regiões) p/ equipe pequena | sistema de portes G/M/P, pipeline data-driven, contingência "Atos gratuitos", fases com gates |
| 2 | Netcode de ação é difícil | Fase 3 dedicada, arquitetura sim-compartilhada desde o dia 1 |
| 3 | Feel não atingir o nível das referências | Fase 1 com gate de morte explícito |
| 4 | iOS/WebView performance | benchmark na Fase 2, plano B documentado |
| 5 | Comparação inevitável com HK ("clone") | identidade própria agressiva (cera/luz, co-op, fauna tropical) + originalidade auditada |

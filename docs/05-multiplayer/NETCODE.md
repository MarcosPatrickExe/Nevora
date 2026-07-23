# Netcode — Arquitetura de Rede

> Status: 🟡 Proposta técnica. Decisões finais dependem do protótipo da Fase 3.

> 🟢 **ADR-012 — duas fases de rede reconhecidas explicitamente:**
> 1. **Validação com amigos (agora):** Colyseus/WebSocket puro, testado entre
>    jogadores da mesma cidade — latência baixa por natureza, não expõe
>    problemas de rede real.
> 2. **Produção/lançamento Steam (antes de lançar):** exigência de robustez
>    bem maior — jogadores espalhados geograficamente. Forte candidato:
>    **Steam Datagram Relay (SDR)** via Steamworks Networking Sockets (grátis
>    para jogos na Steam, resolve NAT traversal e otimiza rota via rede de
>    relés global da Valve sem expor IP dos jogadores) — ver detalhes e
>    pendência em `08-publicacao/PUBLICACAO.md`. Não tratar o sucesso da
>    fase 1 como prova de que a fase 2 está resolvida.

> 🟢 **ADR-005 aplicado à rede:** todos os protocolos, schemas de estado,
> snapshots, IDs de jogador (index 0–3) e limites de sala nascem dimensionados
> para **4 jogadores**, mesmo com o desenvolvimento e os testes iniciais
> focados em 2. Nenhuma mensagem/struct pode assumir "máximo 2".

## Requisitos derivados do design

1. Ação rápida com física precisa → **predição no cliente é obrigatória**.
2. 1–4 jogadores, salas privadas → escala pequena por sala (ótimo: sem
   interest management pesado).
3. Web-first → transportes disponíveis: **WebSocket** (TCP) e **WebRTC
   DataChannel** (UDP-like, não confiável/não ordenado — ideal p/ ação).
4. Co-op PvE entre amigos → tolerância a trapaça é maior que em PvP;
   autoridade pode ser pragmática.

## Modelo proposto: **servidor autoritativo leve + predição de cliente**

- **Servidor de sala** (Node.js) roda a simulação-fonte em **timestep fixo
  (ex.: 60 Hz sim / 20–30 Hz snapshot)**.
- **Cliente:** prediz o próprio personagem (input local aplicado
  imediatamente — zero latência sentida), reconcilia com snapshots;
  **entidades remotas interpoladas** (~100 ms de buffer).
- **Inimigos e bosses simulados no servidor** (fonte única de verdade —
  evita divergência de IA), com animação/efeitos interpolados no cliente.
- **Pacote `sim` compartilhado:** física e regras num pacote TypeScript usado
  por cliente E servidor (mesmo código = predição fiel). Determinismo
  suficiente (floats consistentes em JS; sem necessidade de lockstep).
- **Solo = mesmo código, servidor embutido:** no single player, a "sala" roda
  in-process no cliente (worker). Um único caminho de código para 1–4
  jogadores; offline solo funciona por construção (essencial para PWA).

### Por que não P2P/host-cliente?
- NAT traversal na web exige WebRTC + TURN de qualquer forma;
- host advantage e host migration são dores clássicas;
- servidor de sala pequeno (4 players, PvE) é barato e simplifica tudo.
- ⚠️ Alternativa a manter no radar: host-authoritative via WebRTC (custo zero
  de servidor de simulação, só signaling) — decidir na Fase 3 com números
  reais de custo/latência.

## Stack de rede proposta

| Camada | Proposta | Alternativas |
|---|---|---|
| Framework de salas | **Colyseus** (rooms, state sync, mature em web) | socket.io + custom; nengi.js; custom ws |
| Transporte ação | WebRTC DataChannel unreliable (fallback WebSocket) | WebSocket only (mais simples, +jitter) |
| Serialização | Binária (schema do Colyseus ou flatbuffers-like custom) | JSON (só protótipo) |
| Infra | 1 processo por grupo de salas; regiões (SA, NA, EU) | — |

## Tópicos que exigirão cuidado (registrar desde já)

- **Hit registration:** favorecer o atacante (lag compensation curta ~150 ms
  máx.) — em PvE pode ser generoso.
- **Hit stop/parry com predição:** efeitos locais imediatos, confirmação
  server; parry valida no server com janela estendida pela latência.
- **Salas/portas (transições de tela):** grupo transita junto? Não — cada um
  transita livre; sala só é simulada se tem jogador (design de câmera
  independente). Boss trava a porta ao iniciar (chegou depois = assiste pelo
  "véu" e pode jogar Fulgor para os aliados — a discutir 💡).
- **Reconexão:** ressincronização completa ao voltar (estado é pequeno);
  personagem fica invulnerável parado 30 s ou vira Eco.
- **Persistência de save co-op:** save do anfitrião no servidor + local;
  conflitos resolvidos por "último lampião".
- **Relógio:** clock sync simples (offset por RTT/2, suavizado).

## Metas de qualidade

| Métrica | Alvo |
|---|---|
| Latência percebida no próprio personagem | 0 (predição) |
| Jitter buffer entidades remotas | ≤ 100–120 ms |
| Banda por cliente | ≤ 20 kB/s típico |
| Tick sim / snapshot | 60 Hz / 20–30 Hz |
| Suporte a ping | jogável até ~180 ms; degradação elegante acima |

## Plano de validação (Fase 3)

1. Protótipo greybox 2 jogadores: mover + atacar + 1 inimigo servidor.
2. Testes com latência artificial (100/200/300 ms, 3% loss).
3. Decidir: DataChannel vs WebSocket puro; Colyseus vs custom.
4. Só então congelar o contrato de rede (ADR).

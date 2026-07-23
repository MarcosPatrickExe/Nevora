# Publicação — Plano e Pendências Futuras

> Status: 🟡 Backlog estruturado. Foco atual = **web + PWA**. Este documento
> registra desde já tudo que as outras plataformas vão exigir, para que
> nenhuma decisão de agora inviabilize um port depois.

## Ordem de lançamento proposta

1. **Web + PWA** (lançamento inicial; serve também de demo/marketing vivo)
2. **Steam** (desktop — onde está o público do gênero) ← prioridade nº 2
3. **Epic Games Store**
4. **Google Play** e **App Store**
5. (avaliar depois: itch.io para devlogs/demos, Nintendo Switch — sonho grande,
   exigiria port nativo/parceiro)

## Decisão de modelo comercial (em aberto ⚠️)
- Lojas: **premium** (compra única, sem microtransações).
- Web: decidir entre (a) demo gratuita (1º bioma) + jogo completo nas lojas;
  (b) jogo completo web pago (login); (c) web gratuito por tempo limitado
  (beta aberta) → depois demo. **Recomendo (a)** — web como funil para Steam,
  co-op na demo (viraliza: "vem testar comigo, é grátis").
- Impacto técnico: contas/entitlements se web for pago; senão, nada agora.

## Pendências por plataforma

### 🖥️ Steam
- [ ] Wrapper desktop: **Tauri** (leve) vs **Electron** (maduro) — testar cedo (Fase 4).
- [ ] Steamworks SDK: achievements, cloud saves, rich presence, **Remote Play
      Together** (couch co-op online de graça — enorme para nós).
- [ ] ⚠️ **Multiplayer robusto de produção (ADR-012):** os testes iniciais
      (Colyseus/WebSocket, amigos na mesma cidade) validam a mecânica, mas
      **não validam rede real** — jogadores da Steam estarão espalhados
      geograficamente. Antes do lançamento, avaliar formalmente **Steam
      Datagram Relay (SDR)** via Steamworks Networking Sockets: é grátis
      para jogos publicados na Steam, resolve NAT traversal automaticamente,
      roteia pela rede de relés global da Valve (otimiza latência sem
      servidor próprio) e nunca expõe o IP dos jogadores — encaixa muito bem
      com nosso caso (salas pequenas de até 4, PvE coop). Decidir se substitui
      Colyseus no build de loja ou complementa (web continua Colyseus; Steam
      usa SDR). Ver `05-multiplayer/NETCODE.md`.
- [ ] **Steam Deck verified**: gamepad 100%, texto legível, sem teclado obrigatório.
- [ ] Página da loja cedo (wishlists ≥ 6 meses antes; trailer + demo no Next Fest).
- [ ] Multiplayer: lobby via Steam friends + crossplay com web (decidir se
      salas aceitam mistura de lojas — recomendo sim, com código de sala).
- [ ] Build pipeline: CI → SteamPipe (depots por SO).
- [ ] Taxa Steam Direct (US$ 100/jogo) + cadastro fiscal (empresa/CNPJ ou
      publicação como PF — decidir estrutura legal ⚠️).

### 🎮 Epic Games Store
- [ ] Epic Online Services (EOS): achievements, epic friends; avaliar EOS
      lobbies como alternativa/complemento ao nosso backend.
- [ ] Requisitos de página/certificação próprios; crossplay obrigatório
      declarado.

### 🤖 Google Play
- [ ] Caminho técnico: **TWA (Bubblewrap)** se o PWA performar, senão
      **Capacitor** com WebView otimizada — decidir com benchmark real.
- [ ] Play Console (US$ 25), assinatura AAB, target API level sempre atual.
- [ ] Google Play Games Services (achievements, saves na nuvem) — opcional.
- [ ] Billing: se houver qualquer venda in-app, obrigatório Google Billing.
- [ ] Classificação IARC via console.

### 🍎 App Store
- [ ] **PWA puro não entra na loja**: empacotar com **Capacitor** (WKWebView).
      Atenção à guideline 4.7/2.5.6 (jogos HTML5 empacotados: garantir que o
      binário contém o jogo, não um "launcher de site" — assets no bundle).
- [ ] Apple Developer Program (US$ 99/ano), notarização, TestFlight para beta.
- [ ] Game Center (opcional), regras de privacidade (nutrition labels).
- [ ] Performance WKWebView: validar 60 fps cedo num iPhone médio ⚠️ (risco
      técnico real — se falhar, plano B: port nativo via wrapper tipo
      capacitor-game ou renderer Metal futuro).

### 🌐 Web/PWA (lançamento 1 — pendências de "loja própria")
- [ ] Domínio + landing page + presskit.
- [ ] Infra de salas por região (SA/NA/EU) + status page.
- [ ] Sistema de contas *mínimo* (opcional no solo; necessário p/ co-op
      persistente e cross-save futuro) — decidir provedor (própria vs
      Firebase/Supabase/Clerk) ⚠️ impacta LGPD.
- [ ] Termos de uso + política de privacidade (LGPD/GDPR/COPPA se <13).

## Pendências transversais (valem para todas as lojas)

- [ ] **Classificação etária:** IARC (cobre Play/algumas lojas), ESRB, PEGI,
      **ClassInd (Brasil — obrigatória p/ lojas locais)**. Conteúdo alvo:
      violência de fantasia leve → Livre/10+/E10.
- [ ] **Estrutura legal:** abrir empresa (recomendado p/ contratos de loja e
      impostos EUA — W-8BEN-E), registro de marca do nome do jogo (INPI +
      classe internacional 9/41) — **fazer antes do anúncio público** ⚠️.
- [ ] **Cross-save/cross-play:** exige contas + saves em nuvem; desenhar o
      formato de save já pensando em versão/migração (está em PWA.md).
- [ ] **Localização:** lançamento pt-BR/en; lojas pedem materiais localizados;
      arquitetura i18n pronta desde o dia 1 (strings externalizadas).
- [ ] **Acessibilidade:** exigências crescentes das lojas (e é pilar nosso).
- [ ] **Marketing contínuo:** devlogs (YouTube/TikTok), demo co-op pública,
      Discord da comunidade, Next Fest, festivais (BIG Festival ⭐ Brasil).
- [ ] **Selos de qualidade:** meta interna — Lighthouse 100 (web), Deck
      Verified (Steam), 60 fps mid-phone (mobile).

## Riscos de publicação já identificados

| Risco | Mitigação |
|---|---|
| Performance WebView no iOS | benchmark na Fase 2; plano B nativo |
| Nome colidir com marca existente | pesquisa INPI/global antes do anúncio |
| Custo de servidores co-op pós-lançamento web grátis | demo limita salas; telemetria de custo/sala desde a alpha |
| Payment/contas na web (LGPD) | escopo mínimo de dados; DPO/consultoria antes do launch |
| Multiplayer em lojas exige moderação (chat) | chat só por texto opcional + filtros + report; sem chat público |

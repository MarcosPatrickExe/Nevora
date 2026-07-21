# Escolha de Frameworks e Stack

> Status: 🟢 **Aceita** (ADR-002): Opção A — TypeScript + PixiJS + engine
> própria leve + Colyseus. Condicionada ao gate de qualidade da Fase 1;
> **Godot é o plano B formal** (análise detalhada abaixo).

## Requisitos que a stack precisa atender

1. Web-first (desktop + mobile browser) com PWA e offline solo.
2. 60 fps estáveis em hardware modesto (incl. celulares intermediários).
3. Game feel de precisão (controle total do loop de física — timestep fixo).
4. **Multiplayer:** mesma lógica de simulação rodando no cliente e no servidor
   Node (requisito do netcode → praticamente obriga JS/TS na simulação).
5. Portas futuras: Steam/Epic (desktop) e lojas mobile.
6. Time pequeno + agentes de IA produtivos (linguagem/ecossistema mainstream).

## Opções avaliadas

### Opção A — TypeScript + PixiJS (render) + engine própria leve ⭐ recomendada
- **Render:** PixiJS v8 (WebGL/WebGPU, batching excelente, maduro).
- **Simulação:** ECS leve (ex.: miniplex ou próprio) + física de plataforma
  **própria** (AABB + timestep fixo — padrão em jogos de precisão; física
  "realista" tipo Box2D é errada para o nosso feel).
- **Rede:** Colyseus (Node) compartilhando o pacote `sim`.
- **Áudio:** Web Audio API (wrapper próprio fino ou Howler).
- **UI de menus:** DOM/CSS por cima do canvas (acessível, rápido de iterar).
- ✔ Controle total do feel; sim compartilhada client/server; bundle enxuto;
  performance topo de linha na web.
- ✖ Mais trabalho inicial (câmera, cenas, tilemap, tooling) — mitigado por
  bibliotecas pontuais (ex.: LDtk para level design, ver abaixo).

### Opção B — Phaser 3/4
- ✔ Tudo pronto (cenas, tilemap, input, arcade physics), enorme comunidade,
  protótipo rapidíssimo.
- ✖ Física arcade insuficiente p/ nosso feel (acabaríamos escrevendo a nossa
  do mesmo jeito); acoplar a sim ao Phaser dificulta rodar no servidor;
  overhead/opinião da engine no caminho do netcode.
- 💡 Uso legítimo: **protótipos descartáveis de mecânica na Fase 1**.

### Opção C — Godot 4 (export web) — **plano B formal** *(análise ampliada a pedido do Diretor)*

**Sobre a linguagem:** a linguagem própria do Godot chama-se **GDScript** —
sintaxe parecida com Python, feita sob medida para a engine, muito produtiva.
O Godot também suporta **C#** (.NET) e extensões nativas em C/C++/Rust
(GDExtension).

**Por que Godot é excelente em geral:** editor completo (cenas, animação,
partículas, tilemaps), gratuito e open source, ports desktop (Steam/Epic)
praticamente prontos, comunidade enorme. Se nosso alvo nº 1 fosse Steam,
seria provavelmente a escolha.

**Por que NÃO é a escolha para o Névora (web-first + co-op):**

1. **Peso do export web:** o runtime Godot em WASM gera builds iniciais
   grandes (dezenas de MB antes do primeiro frame) e tempos de load ruins em
   celular — briga direto com nossas metas de PWA ("jogável ≤ 15 s em 4G,
   ≤ 5 MB críticos").
2. **Restrições de navegador:** o export com threads exige
   SharedArrayBuffer, que obriga headers especiais (COOP/COEP) no servidor —
   complica hosting/CDN e historicamente sofre no Safari/iOS. O export
   single-thread evita isso pagando performance.
3. **O motivo decisivo — o servidor do co-op:** nossa arquitetura de rede
   depende de rodar a **mesma simulação** no cliente e no servidor
   (predição + autoridade). Em TypeScript, isso é um pacote `sim` importado
   dos dois lados — barato e elegante. Com Godot, o servidor teria que rodar
   **instâncias headless da engine inteira** por sala (mais memória, mais
   custo por sala, deploy mais pesado) ou reimplementar a física do jogo duas
   vezes (receita de bugs de dessincronização).
4. **Predição/reconciliação custom na web** é caminho pouco documentado no
   high-level multiplayer do Godot; acabaríamos escrevendo netcode do zero
   de qualquer forma, mas dentro de uma engine que não foi desenhada p/ isso
   no navegador.
5. **PWA/offline:** service worker, cache incremental por bioma e updates em
   background são triviais no ecossistema web puro; no export Godot são
   possíveis, porém lutando contra o empacotamento .pck monolítico.

**Quando Godot volta ao jogo (gatilhos do plano B):** se o gate da Fase 1
falhar (feel abaixo do alvo na Opção A) **ou** se abandonarmos web-first.
Nesse cenário, aceitaríamos: web como plataforma secundária, servidor com
Godot headless e builds web pesadas — em troca do editor e do pipeline prontos.

### Opção D — Unity (export WebGL)
- ✖ Builds web pesadas, tempos de load ruins em mobile browser, licenças.
  Descartada para web-first.

### Opção E — Flutter/Flame (aproveitando o repo atual)
- Registrada porque o repositório atual é Flutter.
- ✖ Flame é jovem para metroidvania de precisão; render web do Flutter
  (CanvasKit) pesa; ecossistema de netcode para jogos é incipiente; pipeline
  de assets de jogo é limitado.
- **Recomendação: não usar para o jogo.** O repo do jogo deve ser novo e
  separado (ver `ARQUITETURA.md`).

## Recomendação consolidada (Opção A detalhada)

| Camada | Escolha | Observação |
|---|---|---|
| Linguagem | TypeScript (strict) | única língua em todo o projeto |
| Monorepo | pnpm workspaces + Turborepo | pacotes: `client`, `server`, `sim`, `assets-pipeline`, `tools` |
| Bundler/dev | Vite | HMR, build PWA |
| Render | PixiJS v8 | WebGPU c/ fallback WebGL2 |
| ECS | miniplex (ou próprio se limitar) | avaliar no protótipo |
| Física | própria (AABB, swept, timestep fixo 60 Hz) | interpolação de render |
| Level editor | **LDtk** (editor gratuito excelente) | importer próprio |
| Rede | Colyseus + WebRTC DataChannel | ver NETCODE.md |
| Áudio | Web Audio (wrapper fino) | ducking, camadas, música adaptativa |
| UI | DOM/CSS overlay + HUD in-canvas | i18n desde o dia 1 (pt-BR/en) |
| Testes | Vitest (sim/unit) + Playwright (e2e smoke) | sim determinística = testável |
| CI | GitHub Actions | lint, testes, build, preview deploy |
| Hosting | Cloudflare Pages/Workers ou Fly.io (salas) | decidir na Fase 3 |
| Telemetria | opt-in, anônima (fps, travas, funil) | LGPD/GDPR desde o design |

### Nota sobre ports futuros com essa stack
- **Steam/Epic:** empacotar com **Electron ou Tauri** (jogos web na Steam são
  comuns; ex.: Vampire Survivors lançou em Electron). Steamworks via bindings.
- **Play Store:** TWA/Bubblewrap (PWA vira app) ou Capacitor.
- **App Store:** **Capacitor obrigatório** (Apple não aceita PWA puro na loja).
- Detalhes em `08-publicacao/PUBLICACAO.md`.

## Processo de decisão

1. Fase 1 constrói o protótipo de movimento na Opção A.
2. Se em 3–4 semanas o feel não estiver no nível Celeste-like, reavaliamos
   formalmente (ADR) contra Godot.
3. Decisão registrada em `00-processo/DECISOES.md` como ADR-002.

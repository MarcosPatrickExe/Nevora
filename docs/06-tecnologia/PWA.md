# PWA — Progressive Web App

> Status: 🟡 Proposta

## Objetivo

O jogo roda no navegador e é **instalável como app** (desktop e mobile), com
**modo solo 100% offline** após o primeiro load. Co-op exige rede, obviamente.

## Requisitos técnicos

### Manifest e instalação
- `manifest.webmanifest`: nome, ícones (maskable), `display: fullscreen`,
  `orientation: landscape`, theme color, screenshots (enriquece o prompt de
  instalação no Android).
- Prompt de instalação customizado no menu ("Instalar o jogo") — nunca popup
  agressivo no meio do gameplay.

### Service Worker / cache
- Workbox (ou SW próprio) com estratégia:
  - **App shell + engine:** precache com versionamento por hash.
  - **Assets de biomas:** cache-first com download progressivo — baixa o Vale
    das Velas primeiro, resto em background/on-demand (importante p/ mobile).
  - **Atualizações:** SW novo baixa em background; aplica no próximo boot com
    aviso "Expedição atualizada!" — **nunca** recarregar no meio de sessão.
- Painel "armazenamento" nas opções: tamanho baixado, apagar cache, pré-baixar
  tudo (para viajar offline).

### Saves
- IndexedDB (não localStorage) + export/import manual de save (arquivo).
- Futuro: sync em nuvem com conta (necessário p/ cross-play web↔lojas) —
  registrado em `08-publicacao/PUBLICACAO.md`.
- `navigator.storage.persist()` para reduzir risco de o navegador limpar o save. ⚠️
  Comunicar claramente: instalar o PWA protege melhor o progresso.

### APIs relevantes
| API | Uso |
|---|---|
| Gamepad API | controle (essencial p/ nosso público) |
| Screen Wake Lock | não deixar a tela dormir |
| Fullscreen API | modo imersivo |
| Vibration | feedback mobile/gamepad (onde houver) |
| Web Audio | todo o áudio (desbloqueio no primeiro toque — regra iOS) |
| visibilitychange | auto-pausa (solo) / aviso de AFK (co-op) |

### Limitações conhecidas (planejar em torno)
- **iOS Safari:** sem prompt de instalação nativo (instruir "Adicionar à Tela
  de Início"), storage pode ser expirado pelo sistema (7 dias de inatividade
  para web puro — PWA instalado é mais seguro; reforçar export de save),
  WebGPU parcial (fallback WebGL2 obrigatório), sem Gamepad em alguns
  cenários antigos.
- **Autoplay de áudio** bloqueado até gesto do usuário (tela "toque para
  acender" resolve com elegância temática 🕯️).
- Performance térmica em mobile: modo "economia" (partículas reduzidas, 30 fps
  opcional).

## Controles por plataforma web
- Desktop: teclado (remapeável) e gamepad.
- Mobile: controles touch **desenhados de verdade** (não overlay preguiçoso):
  alavanca virtual com dead zone boa, botões grandes, layout editável e
  presets canhoto/destro. Gamepad bluetooth suportado.

## Métricas de sucesso PWA
- Primeiro load jogável ≤ 15 s em 4G (≤ 5 MB críticos).
- Boot offline (instalado) ≤ 3 s.
- Lighthouse PWA score 100 no shell.

/* Névora protótipo — service worker: joga offline, mas nunca prende o
   jogador numa versão velha.

   Esse arquivo já causou dois incidentes de "a atualização não aparece"
   (o mais recente em 2026-07-31 — ver docs/00-processo/DIARIO_DE_BORDO.md)
   porque dependia de um humano lembrar de subir o número de CACHE toda vez.
   Correção estrutural, pra não depender de memória nunca mais:

   1. CACHE usa __BUILD_ID__, um placeholder substituído automaticamente
      pelo SHA do commit em CADA deploy (ver o passo "Stamp cache-busting
      build id" em .github/workflows/pages.yml) — sempre único, sem
      intervenção humana. Localmente (fora do CI) o placeholder fica
      literal, o que não tem problema nenhum pro desenvolvimento.
   2. fetch() virou "rede primeiro, cache como reserva" (em vez de
      "cache primeiro") — mesmo que o passo 1 falhasse por algum motivo, o
      jogador online sempre recebe a versão mais nova, porque o service
      worker sempre tenta baixar antes de recorrer ao cache. O cache só
      entra em ação quando não há rede (jogo offline). */
const CACHE = 'nevora-proto-__BUILD_ID__';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'manifest.webmanifest',
  'icon.svg',
  'js/input.js',
  'js/audio.js',
  'js/classes.js',
  'js/save.js',
  'js/touch-layout.js',
  'js/world.js',
  'js/map.js',
  'js/entities.js',
  'js/render.js',
  'js/game.js',
  'js/main.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // cache: 'no-store' é necessário aqui — sem isso o fetch() ainda podia
  // ser respondido pelo cache HTTP comum do navegador (não o Cache API
  // acima, um outro cache, por baixo dos panos) e nunca ia de fato até a
  // rede, mesmo essa estratégia já sendo "rede primeiro"
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});

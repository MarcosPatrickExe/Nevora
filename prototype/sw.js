/* Névora protótipo — service worker: cache-first para jogar offline.
   IMPORTANTE: sempre que qualquer arquivo em ASSETS mudar de conteúdo,
   suba o número de CACHE nesta mesma linha. Sem isso o navegador continua
   servindo os arquivos antigos do cache pra sempre (cache-first não tem
   como saber que o conteúdo mudou sozinho) — foi exatamente o que causou
   os botões touch aparecerem bagunçados numa v3 já publicada: o
   index.html novo carregava, mas o style.css ficava preso na versão de
   antes do D-pad existir. */
const CACHE = 'nevora-proto-v3.3';
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
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      });
    })
  );
});

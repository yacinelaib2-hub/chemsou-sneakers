const CACHE_NAME = "chemsou-sneakers-static-v1";
const STATIC_ASSETS = [
    "manifest.php",
    "style.css",
    "script.js",
    "assets/app-icon-192.png",
    "assets/app-icon-512.png",
    "assets/chemsou-logo.png",
    "assets/mus-locker-logo.png.png"
];

self.addEventListener("install", event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(names => Promise.all(names.filter(name => (name.startsWith("mus-locker-") || name.startsWith("chemsou-sneakers-")) && name !== CACHE_NAME).map(name => caches.delete(name))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);
    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    const isStaticAsset = STATIC_ASSETS.some(asset => url.pathname === new URL(asset, self.registration.scope).pathname);
    if (isStaticAsset) {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_NAME);
            try {
                const response = await fetch(request);
                if (response.ok && response.type === "basic") cache.put(request, response.clone());
                return response;
            } catch {
                const cached = await cache.match(request);
                if (cached) return cached;
                return new Response("Offline", {status: 503, statusText: "Offline"});
            }
        })());
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(fetch(request).catch(() => new Response(
            "<!doctype html><html lang=\"fr\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta charset=\"utf-8\"><title>Chemsou Sneakers</title><body style=\"font:16px Arial,sans-serif;max-width:440px;margin:15vh auto;padding:24px;color:#111\"><h1>Chemsou Sneakers</h1><p>Connexion Internet nécessaire pour afficher la boutique. Vérifie ton réseau puis réessaie.</p><button onclick=\"location.reload()\" style=\"padding:12px 18px;background:#111;color:white;border:0\">Réessayer</button></body></html>",
            {status: 503, headers: {"Content-Type": "text/html; charset=utf-8"}}
        )));
    }
});

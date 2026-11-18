/* One-time migration worker: retire the previous Workbox cache layer. */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("workbox-") || key.startsWith("vite-pwa-"))
          .map((key) => caches.delete(key)),
      );

      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      await self.registration.unregister();

      await Promise.all(
        windows.map((client) => client.navigate(client.url)),
      );
    })(),
  );
});

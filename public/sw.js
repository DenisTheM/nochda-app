const CACHE = "nochda-v2";
const ASSETS = ["/"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).catch(() => caches.match("/")));
  }
});

self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "nochda", {
      body: data.body || "Zeit für deinen Check-in!",
      icon: "/icon-192.png",
      badge: "/badge-72.png",
      tag: "nochda-reminder",
      data: { action: "checkin" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window" }).then((cls) => {
      if (cls.length > 0) {
        cls[0].postMessage({ type: "CHECKIN_FROM_NOTIFICATION" });
        return cls[0].focus();
      }
      return clients.openWindow("/");
    })
  );
});

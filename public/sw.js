const CACHE_NAME = "nochda-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(["/", "/index.html"])));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE_NAME).map((x) => caches.delete(x)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE_NAME).then((ca) => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request))
  );
});

self.addEventListener("push", (e) => {
  if (!e.data) return;
  let d; try { d = e.data.json(); } catch { d = { title: "nochda", body: e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "nochda", {
    body: d.body || "Zeit für deinen Check-in!", icon: "/icon-192.png", badge: "/badge-72.png",
    tag: d.tag || "nochda-notification", renotify: true, vibrate: [200, 100, 200],
    data: { url: d.url || "/" },
    actions: [{ action: "checkin", title: "✓ Mir geht's gut" }, { action: "dismiss", title: "Später" }],
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const c of list) {
      if (c.url.includes(self.location.origin)) {
        if (e.action === "checkin") c.postMessage({ type: "CHECKIN_FROM_NOTIFICATION" });
        return c.focus();
      }
    }
    return clients.openWindow(e.notification.data?.url || "/");
  }));
});

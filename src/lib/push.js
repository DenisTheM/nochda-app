import { VAPID_PUBLIC_KEY } from "../config/index.js";
import { savePushSubscription } from "./api.js";

function urlBase64ToUint8Array(base64) {
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try { return await navigator.serviceWorker.register("/sw.js", { scope: "/" }); }
  catch (e) { console.error("SW registration failed:", e); return null; }
}

export async function getPushState() {
  if (!("PushManager" in window)) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub ? "subscribed" : "prompt";
  } catch { return "prompt"; }
}

export async function subscribePush() {
  if (!("PushManager" in window)) return null;
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return null;
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }
  await savePushSubscription(sub);
  return sub;
}

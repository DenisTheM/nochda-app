import { useState, useEffect, useCallback } from "react";
import * as api from "../lib/api.js";
import { registerServiceWorker, getPushState, subscribePush } from "../lib/push.js";
import { getToday } from "../lib/utils.js";
import { DEFAULT_LANG } from "../config/index.js";

export function useAppData(user) {
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [pushState, setPushState] = useState("prompt");
  const [lang, setLang] = useState(DEFAULT_LANG);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, c, ch] = await Promise.all([
        api.getProfile(),
        api.getContacts(),
        api.getCheckins(),
      ]);
      if (p) { setProfile(p); setLang(p.language || DEFAULT_LANG); }
      setContacts(c);
      setCheckins(ch);
      await registerServiceWorker();
      setPushState(await getPushState());
    })();
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "CHECKIN_FROM_NOTIFICATION") checkin();
    };
    navigator.serviceWorker?.addEventListener("message", handler);
    return () => navigator.serviceWorker?.removeEventListener("message", handler);
  }, [user, checkins]);

  // ── Subscription helpers ───────────────────────────────────────────
  const subscriptionStatus = profile?.subscription_status || "trial";
  const trialEndsAt = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const daysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt - Date.now()) / 86400000))
    : null;
  const isActive =
    subscriptionStatus === "active" ||
    (subscriptionStatus === "trial" && daysLeft > 0);

  // ── Actions ────────────────────────────────────────────────────────
  const checkin = useCallback(async () => {
    if (!user) return;
    if (checkins.some((c) => c.date === getToday())) return;
    try {
      const data = await api.doCheckin();
      if (data) setCheckins((prev) => [data, ...prev]);
      return data;
    } catch { return null; }
  }, [user, checkins]);

  const enablePush = useCallback(async () => {
    const sub = await subscribePush();
    setPushState(sub ? "subscribed" : "denied");
  }, []);

  const saveProfile = useCallback(async (updates) => {
    await api.updateProfile(updates);
    setProfile((p) => ({ ...p, ...updates }));
    if (updates.language) setLang(updates.language);
  }, []);

  const addContact = useCallback(async (contact) => {
    const data = await api.addContact(contact);
    if (data) setContacts((prev) => [...prev, data]);
  }, []);

  const editContact = useCallback(async (id, updates) => {
    await api.updateContact(id, updates);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const removeContact = useCallback(async (id) => {
    await api.deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const upgrade = useCallback(async (plan = "standard") => {
    const { url } = await api.createCheckout(plan);
    if (url) window.location.href = url;
  }, []);

  return {
    profile, contacts, checkins, pushState, lang,
    setLang,
    // Subscription
    subscriptionStatus, daysLeft, isActive,
    // Actions
    checkin, enablePush, saveProfile,
    addContact, editContact, removeContact,
    upgrade,
  };
}

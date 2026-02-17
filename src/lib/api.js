import { supabase } from "./supabase.js";
import { CHECKIN_HISTORY_LIMIT } from "../config/index.js";

const today = () => new Date().toISOString().slice(0, 10);
const uid = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data?.user) throw new Error("Not authenticated");
  return data.user.id;
};

// Auth
export async function signUp(email, password, name) {
  return supabase.auth.signUp({ email, password, options: { data: { name } } });
}
export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}
export async function signOut() { return supabase.auth.signOut(); }
export async function getSession() { return supabase.auth.getSession(); }
export function onAuthChange(cb) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => cb(s?.user || null));
  return subscription;
}

// Profile
export async function getProfile() {
  const { data } = await supabase.from("profiles").select("*").single();
  return data;
}
export async function updateProfile(updates) {
  const id = await uid();
  return supabase.from("profiles").update(updates).eq("id", id);
}

// Contacts
export async function getContacts() {
  const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: true });
  return data || [];
}
export async function addContact(contact) {
  const id = await uid();
  const { data } = await supabase.from("contacts").insert({ ...contact, user_id: id }).select();
  return data?.[0] || null;
}
export async function updateContact(id, updates) {
  return supabase.from("contacts").update(updates).eq("id", id);
}
export async function deleteContact(id) {
  return supabase.from("contacts").delete().eq("id", id);
}

// Check-ins
export async function getCheckins() {
  const { data } = await supabase.from("checkins").select("*").order("date", { ascending: false }).limit(CHECKIN_HISTORY_LIMIT);
  return data || [];
}
export async function doCheckin() {
  const id = await uid();
  const { data, error } = await supabase.from("checkins").upsert(
    { user_id: id, date: today(), checked_at: new Date().toISOString() },
    { onConflict: "user_id,date" }
  ).select();
  if (error) throw error;
  return data?.[0] || null;
}

// Push
export async function savePushSubscription(sub) {
  const id = await uid();
  const json = sub.toJSON();
  return supabase.from("push_subscriptions").upsert({
    user_id: id, endpoint: json.endpoint,
    p256dh: json.keys?.p256dh || "", auth: json.keys?.auth || "",
    user_agent: navigator.userAgent.slice(0, 200),
  }, { onConflict: "endpoint" });
}

// ── Stripe Checkout ──────────────────────────────────────────────────────
export async function createCheckout(plan = "standard") {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ plan }),
    }
  );

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ── Pause alarm ──────────────────────────────────────────────────────────
export async function pauseAlarm(until) {
  const id = await uid();
  return supabase.from("profiles").update({ paused_until: until }).eq("id", id);
}

export async function resumeAlarm() {
  const id = await uid();
  return supabase.from("profiles").update({ paused_until: null }).eq("id", id);
}

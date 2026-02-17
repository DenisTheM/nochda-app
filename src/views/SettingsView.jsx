import { useState } from "react";
import { signOut } from "../lib/api.js";
import LangSwitcher from "../components/LangSwitcher.jsx";

const S = {
  screen: { display: "flex", flexDirection: "column", height: "100vh", background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--font-body)" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--c-border)" },
  back: { background: "none", border: "none", color: "var(--c-accent)", fontSize: 18, cursor: "pointer", padding: "4px 8px", fontFamily: "var(--font-body)" },
  body: { flex: 1, padding: "24px 24px", overflow: "auto" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#737373", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, marginTop: 18 },
  input: { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--c-border-light)", borderRadius: "var(--r-md)", color: "var(--c-text)", fontSize: 15, fontFamily: "var(--font-body)", outline: "none" },
  sliderRow: { display: "flex", alignItems: "center", gap: 16 },
  sliderVal: { fontFamily: "var(--font-display)", fontSize: 14, color: "var(--c-accent)", minWidth: 80, textAlign: "right" },
  pushBadge: { padding: "10px 14px", background: "var(--c-accent-bg)", border: "1px solid var(--c-accent-border)", borderRadius: "var(--r-md)", color: "var(--c-accent)", fontSize: 13 },
  pushBtn: { background: "var(--c-accent-bg)", border: "1px solid var(--c-accent-border)", borderRadius: "var(--r-sm)", color: "var(--c-accent)", fontSize: 13, padding: "6px 14px", cursor: "pointer", fontFamily: "var(--font-body)" },
  primary: { display: "block", width: "100%", padding: "14px 0", marginTop: 32, background: "linear-gradient(145deg, #15803d, #166534)", border: "none", borderRadius: "var(--r-md)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" },
  danger: { display: "block", width: "100%", padding: "12px 0", marginTop: 24, background: "var(--c-danger-bg)", border: "1px solid var(--c-danger-border)", borderRadius: "var(--r-md)", color: "var(--c-danger)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" },
  gdpr: { fontSize: 11, color: "#404040", textAlign: "center", marginTop: 32, lineHeight: 1.5 },
};

export default function SettingsView({ t, profile, pushState, onEnablePush, onSave, onCancel }) {
  const [name, setName] = useState(profile?.name || "");
  const [hours, setHours] = useState(profile?.deadline_hours || 24);
  const [reminder, setReminder] = useState(profile?.reminder_hour || 9);
  const [language, setLanguage] = useState(profile?.language || "de");

  return (
    <div style={S.screen}>
      <div style={S.header}>
        <button onClick={onCancel} style={S.back}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)" }}>{t.settings}</h2>
        <div style={{ width: 32 }} />
      </div>
      <div style={S.body}>
        <label style={S.label}>{t.name}</label>
        <input style={S.input} value={name} onChange={(e) => setName(e.target.value)} />
        <label style={S.label}>{t.deadline}</label>
        <div style={S.sliderRow}>
          <input type="range" min="12" max="72" step="12" value={hours} onChange={(e) => setHours(+e.target.value)} style={{ flex: 1, cursor: "pointer" }} />
          <span style={S.sliderVal}>{hours} {t.hours}</span>
        </div>
        <label style={S.label}>{t.reminderAt}</label>
        <div style={S.sliderRow}>
          <input type="range" min="6" max="22" step="1" value={reminder} onChange={(e) => setReminder(+e.target.value)} style={{ flex: 1, cursor: "pointer" }} />
          <span style={S.sliderVal}>{String(reminder).padStart(2, "0")}:00</span>
        </div>
        <label style={S.label}>Language / Sprache</label>
        <LangSwitcher value={language} onChange={setLanguage} />
        <label style={{ ...S.label, marginTop: 24 }}>Push Notifications</label>
        {pushState === "subscribed" ? <div style={S.pushBadge}>🔔 {t.pushEnabled}</div>
          : pushState === "denied" ? <div style={{ ...S.pushBadge, borderColor: "var(--c-danger-border)", color: "var(--c-danger)" }}>🔕 {t.pushDenied}</div>
          : pushState === "unsupported" ? <div style={{ ...S.pushBadge, borderColor: "rgba(255,255,255,0.1)", color: "#525252" }}>{t.pushUnsupported}</div>
          : <button onClick={onEnablePush} style={S.pushBtn}>🔔 {t.pushEnable}</button>}
        <button onClick={() => onSave({ name, deadline_hours: hours, reminder_hour: reminder, language })} style={S.primary}>{t.save}</button>
        <button onClick={async () => { await signOut(); onCancel(); }} style={S.danger}>{t.signOut}</button>
        <div style={S.gdpr}>{t.gdprNote}</div>
      </div>
    </div>
  );
}

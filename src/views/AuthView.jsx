import { useState } from "react";
import { signIn, signUp } from "../lib/api.js";
import LangSwitcher from "../components/LangSwitcher.jsx";

const S = {
  screen: { display: "flex", flexDirection: "column", height: "100vh", background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--font-body)" },
  container: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { width: "100%", maxWidth: 380, animation: "fadeIn 0.6s ease-out" },
  logo: { textAlign: "center", marginBottom: 24 },
  title: { fontFamily: "var(--font-display)", fontSize: 26, color: "var(--c-accent)", margin: 0, letterSpacing: -1 },
  tagline: { color: "#525252", fontSize: 13, marginTop: 6 },
  stepRow: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 },
  stepNum: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, borderRadius: 12, background: "rgba(74,222,128,0.12)", color: "var(--c-accent)", fontSize: 12, fontWeight: 700 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#737373", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, marginTop: 18 },
  input: { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--c-border-light)", borderRadius: "var(--r-md)", color: "var(--c-text)", fontSize: 15, fontFamily: "var(--font-body)", outline: "none" },
  btn: { display: "block", width: "100%", padding: "14px 0", marginTop: 20, background: "linear-gradient(145deg, #15803d, #166534)", border: "none", borderRadius: "var(--r-md)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" },
  switchBtn: { background: "none", border: "none", color: "var(--c-accent)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" },
  error: { background: "var(--c-danger-bg)", border: "1px solid var(--c-danger-border)", borderRadius: "var(--r-sm)", padding: "8px 12px", color: "var(--c-danger)", fontSize: 13, marginTop: 12 },
  gdpr: { fontSize: 11, color: "#404040", textAlign: "center", marginTop: 32, lineHeight: 1.5 },
};

export default function AuthView({ t, lang, setLang }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    setError(""); setBusy(true);
    try {
      const { error: e } = mode === "signup" ? await signUp(email, password, name) : await signIn(email, password);
      if (e) throw e;
    } catch (e) { setError(e.message || "Error"); }
    setBusy(false);
  };

  return (
    <div style={S.screen}>
      <div style={S.container}>
        <div style={S.card}>
          <div style={S.logo}>
            <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 12 }}>
              <circle cx="40" cy="40" r="36" stroke="#4ade80" strokeWidth="2.5" fill="none" />
              <path d="M26 42l10 10 18-20" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <h1 style={S.title}>{t.appName}</h1>
            <p style={S.tagline}>{t.tagline}</p>
          </div>
          <div style={{ marginBottom: 24 }}>
            {[t.onboard1, t.onboard2, t.onboard3].map((step, i) => (
              <div key={i} style={S.stepRow}>
                <span style={S.stepNum}>{i + 1}</span>
                <span style={{ color: "#a3a3a3", fontSize: 13, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
          {mode === "signup" && (<><label style={S.label}>{t.name}</label><input style={S.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Max Muster" /></>)}
          <label style={S.label}>{t.email}</label>
          <input style={S.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="du@beispiel.ch" />
          <label style={S.label}>{t.password}</label>
          <input style={S.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          {error && <div style={S.error}>{error}</div>}
          <button onClick={handleSubmit} disabled={busy} style={{ ...S.btn, opacity: busy ? 0.6 : 1 }}>{busy ? "..." : mode === "signup" ? t.signUp : t.signIn}</button>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} style={S.switchBtn}>
              {mode === "signin" ? t.noAccount + " " + t.signUp : t.hasAccount + " " + t.signIn}
            </button>
          </div>
          <LangSwitcher value={lang} onChange={setLang} />
          <div style={S.gdpr}>{t.gdprNote}</div>
        </div>
      </div>
    </div>
  );
}

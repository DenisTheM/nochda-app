import { useState } from "react";

const S = {
  screen: { display: "flex", flexDirection: "column", height: "100vh", background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--font-body)" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--c-border)" },
  back: { background: "none", border: "none", color: "var(--c-accent)", fontSize: 18, cursor: "pointer", padding: "4px 8px", fontFamily: "var(--font-body)" },
  body: { flex: 1, padding: "24px 24px", overflow: "auto" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#737373", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, marginTop: 18 },
  input: { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--c-border-light)", borderRadius: "var(--r-md)", color: "var(--c-text)", fontSize: 15, fontFamily: "var(--font-body)", outline: "none" },
  primary: { display: "block", width: "100%", padding: "14px 0", marginTop: 24, background: "linear-gradient(145deg, #15803d, #166534)", border: "none", borderRadius: "var(--r-md)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" },
  danger: { display: "block", width: "100%", padding: "12px 0", marginTop: 12, background: "var(--c-danger-bg)", border: "1px solid var(--c-danger-border)", borderRadius: "var(--r-md)", color: "var(--c-danger)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" },
};

export default function ContactFormView({ t, initial, onSave, onDelete, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [relation, setRelation] = useState(initial?.relation || "");
  const valid = name.trim() && email.trim() && email.includes("@");

  return (
    <div style={S.screen}>
      <div style={S.header}>
        <button onClick={onCancel} style={S.back}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)" }}>{initial ? t.contacts : t.addContact}</h2>
        <div style={{ width: 32 }} />
      </div>
      <div style={S.body}>
        <label style={S.label}>{t.contactName}</label>
        <input style={S.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Anna Müller" />
        <label style={S.label}>{t.email}</label>
        <input style={S.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anna@example.com" />
        <label style={S.label}>{t.phone}</label>
        <input style={S.input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+41 79 123 45 67" />
        <label style={S.label}>{t.relation}</label>
        <input style={S.input} value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Schwester, Nachbar..." />
        <button onClick={() => onSave({ name, email, phone, relation })} disabled={!valid} style={{ ...S.primary, opacity: valid ? 1 : 0.4 }}>{t.save}</button>
        {onDelete && <button onClick={onDelete} style={S.danger}>{t.delete}</button>}
      </div>
    </div>
  );
}

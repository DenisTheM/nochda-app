const S = {
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 700, color: "var(--c-text)" },
  addBtn: { background: "var(--c-accent-bg)", border: "1px solid var(--c-accent-border)", borderRadius: "var(--r-sm)", color: "var(--c-accent)", fontSize: 13, padding: "6px 14px", cursor: "pointer", fontFamily: "var(--font-body)" },
  empty: { color: "#525252", fontSize: 14, textAlign: "center", marginTop: 40 },
  card: { display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 14, marginBottom: 10, cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)" },
  avatar: { width: 40, height: 40, borderRadius: 20, background: "rgba(74,222,128,0.12)", color: "var(--c-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 },
  name: { fontSize: 15, fontWeight: 600, color: "var(--c-text)" },
  detail: { fontSize: 12, color: "#737373", marginTop: 2 },
  relation: { fontSize: 11, color: "var(--c-accent)", marginTop: 2, opacity: 0.7 },
  gdpr: { fontSize: 11, color: "#404040", textAlign: "center", marginTop: 32, lineHeight: 1.5 },
};

export default function ContactsView({ t, contacts, onEdit, onAdd }) {
  return (
    <div style={{ flex: 1, padding: "20px 24px", overflow: "auto" }}>
      <div style={S.row}>
        <h2 style={S.title}>{t.contacts}</h2>
        <button onClick={onAdd} style={S.addBtn}>+ {t.addContact}</button>
      </div>
      {contacts.length === 0 ? <p style={S.empty}>{t.noContacts}</p> : contacts.map((c) => (
        <div key={c.id} style={S.card} onClick={() => onEdit(c)}>
          <div style={S.avatar}>{c.name.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div style={S.name}>{c.name}</div>
            <div style={S.detail}>{c.email}</div>
            {c.relation && <div style={S.relation}>{c.relation}</div>}
          </div>
          <span style={{ color: "#404040", fontSize: 20 }}>›</span>
        </div>
      ))}
      <div style={S.gdpr}>{t.gdprNote}</div>
    </div>
  );
}

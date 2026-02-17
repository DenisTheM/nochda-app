const S = {
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 20px", borderBottom: "1px solid var(--c-border)",
    position: "relative", zIndex: 10,
  },
  logo: {
    fontWeight: 700, fontSize: 20, color: "var(--c-accent)",
    letterSpacing: -0.5, fontFamily: "var(--font-body)",
  },
  streak: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "5px 14px", borderRadius: 100,
    background: "var(--c-gold-bg)",
    border: "1px solid var(--c-gold-border)",
    fontSize: 13, fontWeight: 600, color: "var(--c-gold)",
  },
  back: {
    background: "none", border: "none", color: "var(--c-accent)",
    fontSize: 18, cursor: "pointer", padding: "4px 8px", fontFamily: "var(--font-body)",
  },
  spacer: { width: 60 },
};

export default function Header({ t, view, setView, streak = 0 }) {
  return (
    <div style={S.header}>
      {view !== "home" ? (
        <button onClick={() => setView("home")} style={S.back}>←</button>
      ) : (
        <span style={S.logo}>{t.appName}</span>
      )}
      {view !== "home" && <h1 style={{ ...S.logo, fontSize: 17 }}>{
        view === "contacts" ? t.contacts : view === "history" ? t.history : t.settings
      }</h1>}
      {streak > 0 ? (
        <div style={S.streak}>
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      ) : <div style={S.spacer} />}
    </div>
  );
}

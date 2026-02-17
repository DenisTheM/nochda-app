const S = {
  screen: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "100vh",
    background: "var(--c-bg)", color: "var(--c-text)",
    fontFamily: "var(--font-body)", padding: 24, textAlign: "center",
  },
  icon: {
    width: 72, height: 72, borderRadius: "50%",
    background: "rgba(74,222,128,0.1)", border: "2px solid rgba(74,222,128,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 24, fontSize: 32,
  },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 12 },
  sub: { fontSize: 15, color: "#8a8a8a", lineHeight: 1.6, maxWidth: 380, marginBottom: 32 },
  btn: {
    padding: "16px 40px", background: "#4ade80", color: "#000",
    border: "none", borderRadius: 12, fontSize: 17, fontWeight: 700,
    cursor: "pointer", fontFamily: "var(--font-body)",
    marginBottom: 16, width: "100%", maxWidth: 320,
  },
  secondary: {
    padding: "12px 40px", background: "transparent",
    color: "#8a8a8a", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12, fontSize: 14, fontWeight: 500,
    cursor: "pointer", fontFamily: "var(--font-body)",
    width: "100%", maxWidth: 320,
  },
};

export default function PaywallView({ t, onUpgrade, onSignOut }) {
  return (
    <div style={S.screen}>
      <div style={S.icon}>✓</div>
      <h1 style={S.title}>Deine Testphase ist vorbei</h1>
      <p style={S.sub}>
        Du hast nochda 30 Tage lang kostenlos getestet.
        Um weiterhin geschützt zu sein, wähle jetzt deinen Plan.
      </p>
      <button style={S.btn} onClick={onUpgrade}>Plan wählen</button>
      <button style={S.secondary} onClick={onSignOut}>Abmelden</button>
    </div>
  );
}

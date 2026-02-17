import { useState } from "react";

const S = {
  screen: {
    display: "flex", flexDirection: "column", minHeight: "100vh",
    background: "var(--c-bg)", color: "var(--c-text)",
    fontFamily: "var(--font-body)", padding: "80px 20px 40px",
  },
  back: {
    background: "none", border: "none", color: "#4ade80",
    fontSize: 15, cursor: "pointer", padding: "4px 0",
    fontFamily: "var(--font-body)", marginBottom: 24, textAlign: "left",
  },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
  sub: { fontSize: 14, color: "#8a8a8a", marginBottom: 32, lineHeight: 1.5 },
  cards: { display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 },
  card: {
    padding: "24px 20px", background: "#0e0e0e",
    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16,
    cursor: "pointer", transition: "border-color 0.2s, transform 0.2s",
    position: "relative",
  },
  cardActive: { borderColor: "rgba(74,222,128,0.4)", transform: "scale(1.02)" },
  badge: {
    position: "absolute", top: -10, right: 16,
    padding: "3px 10px", borderRadius: 5, fontSize: 10,
    fontWeight: 800, letterSpacing: 0.5,
  },
  badgeSoon: {
    background: "rgba(251,191,36,0.15)", color: "#fbbf24",
    border: "1px solid rgba(251,191,36,0.25)",
  },
  planName: { fontSize: 13, fontWeight: 700, color: "#8a8a8a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  price: { fontSize: 32, fontWeight: 700, marginBottom: 4 },
  priceSpan: { fontSize: 14, fontWeight: 400, color: "#8a8a8a" },
  desc: { fontSize: 13, color: "#6a6a6a", marginBottom: 16, lineHeight: 1.4 },
  features: { listStyle: "none", padding: 0, margin: 0 },
  feat: {
    padding: "5px 0", fontSize: 13, color: "#a3a3a3",
    display: "flex", alignItems: "center", gap: 8,
  },
  check: { color: "#4ade80", fontWeight: 700, fontSize: 12 },
  btn: {
    marginTop: 24, padding: "16px 0", width: "100%", maxWidth: 400,
    background: "#4ade80", color: "#000", border: "none",
    borderRadius: 12, fontSize: 16, fontWeight: 700,
    cursor: "pointer", fontFamily: "var(--font-body)",
    transition: "opacity 0.2s",
  },
  btnDisabled: { opacity: 0.5, pointerEvents: "none" },
  btnLoading: { opacity: 0.6 },
};

export default function PlanPickerView({ onSelect, onCancel }) {
  const [selected, setSelected] = useState("standard");
  const [loading, setLoading] = useState(false);

  const familyAvailable = true;

  const handleContinue = async () => {
    if (selected === "family" && !familyAvailable) return;
    setLoading(true);
    try {
      await onSelect(selected);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div style={S.screen}>
      <button style={S.back} onClick={onCancel}>← Zurück</button>
      <h1 style={S.title}>Wähle deinen Plan</h1>
      <p style={S.sub}>Jeder Plan startet mit 30 Tagen kostenlos.</p>

      <div style={S.cards}>
        {/* Standard */}
        <div
          style={{ ...S.card, ...(selected === "standard" ? S.cardActive : {}) }}
          onClick={() => setSelected("standard")}
        >
          <div style={S.planName}>Standard</div>
          <div style={S.price}>€1,99 <span style={S.priceSpan}>/ Monat</span></div>
          <div style={S.desc}>Alles was du brauchst</div>
          <ul style={S.features}>
            <li style={S.feat}><span style={S.check}>✓</span> Täglicher Check-in</li>
            <li style={S.feat}><span style={S.check}>✓</span> 1 Notfallkontakt</li>
            <li style={S.feat}><span style={S.check}>✓</span> E-Mail-Alarme</li>
            <li style={S.feat}><span style={S.check}>✓</span> Push-Erinnerungen</li>
            <li style={S.feat}><span style={S.check}>✓</span> Alarm pausieren</li>
          </ul>
        </div>

        {/* Familie */}
        <div
          style={{
            ...S.card,
            ...(selected === "family" ? S.cardActive : {}),
          }}
          onClick={() => setSelected("family")}
        >
          <div style={S.planName}>Familie</div>
          <div style={S.price}>€4,99 <span style={S.priceSpan}>/ Monat</span></div>
          <div style={S.desc}>Für Angehörige die sich kümmern</div>
          <ul style={S.features}>
            <li style={S.feat}><span style={S.check}>✓</span> Alles aus Standard</li>
            <li style={S.feat}><span style={S.check}>✓</span> Bis zu 5 Notfallkontakte</li>
            <li style={S.feat}><span style={S.check}>✓</span> Bis zu 5 betreute Personen</li>
            <li style={S.feat}><span style={S.check}>✓</span> Familien-Dashboard</li>
            <li style={S.feat}><span style={S.check}>✓</span> Notizen & Alarm pro Person</li>
          </ul>
        </div>
      </div>

      <button
        style={{ ...S.btn, ...(loading ? S.btnLoading : {}) }}
        onClick={handleContinue}
      >
        {loading ? "Wird geladen..." : "Weiter zu Stripe →"}
      </button>
    </div>
  );
}

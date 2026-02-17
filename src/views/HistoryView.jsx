import { timeAgo } from "../lib/utils.js";

export default function HistoryView({ t, checkins }) {
  return (
    <div style={{ flex: 1, padding: "20px 24px", overflow: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--c-text)", marginBottom: 16 }}>{t.history}</h2>
      {checkins.length === 0 ? <p style={{ color: "#525252", fontSize: 14, textAlign: "center", marginTop: 40 }}>—</p> : checkins.map((c) => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ color: "var(--c-accent)", fontSize: 8 }}>●</span>
          <span style={{ fontSize: 14, color: "var(--c-text)", fontFamily: "var(--font-display)" }}>{c.date}</span>
          <span style={{ fontSize: 12, color: "#525252", marginLeft: "auto" }}>{timeAgo(c.date, t)}</span>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";

const S = {
  banner: {
    padding: "10px 20px",
    background: "rgba(74,222,128,0.08)",
    borderBottom: "1px solid rgba(74,222,128,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  text: { fontSize: 13, color: "#4ade80", fontWeight: 500 },
  btn: {
    padding: "6px 14px",
    background: "#4ade80",
    color: "#000",
    border: "none",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    whiteSpace: "nowrap",
  },
  expired: {
    background: "rgba(239,68,68,0.08)",
    borderBottom: "1px solid rgba(239,68,68,0.15)",
  },
  expiredText: { color: "#ef4444" },
};

export default function TrialBanner({ daysLeft, isActive, onUpgrade }) {
  if (isActive && daysLeft === null) return null; // paid user

  if (!isActive) {
    return (
      <div style={{ ...S.banner, ...S.expired }}>
        <span style={{ ...S.text, ...S.expiredText }}>
          Deine Testphase ist abgelaufen
        </span>
        <button style={S.btn} onClick={onUpgrade}>Jetzt upgraden</button>
      </div>
    );
  }

  if (daysLeft > 7) return null; // don't show if plenty of time

  return (
    <div style={S.banner}>
      <span style={S.text}>
        {daysLeft <= 1
          ? "Letzter Tag deiner Testphase!"
          : `Noch ${daysLeft} Tage kostenlos`}
      </span>
      <button style={S.btn} onClick={onUpgrade}>Jetzt upgraden</button>
    </div>
  );
}

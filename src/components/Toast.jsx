import { useState, useEffect } from "react";

const S = {
  wrapper: {
    position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
    zIndex: 9999, pointerEvents: "none",
  },
  toast: {
    background: "#0e0e0e", border: "1px solid var(--c-accent-border)",
    borderRadius: "var(--r-md)", padding: "14px 20px",
    display: "flex", alignItems: "center", gap: 10,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    animation: "fadeIn 0.3s ease-out",
    maxWidth: 340,
  },
  icon: { fontSize: 18, flexShrink: 0 },
  text: { color: "var(--c-text)", fontSize: 14, lineHeight: 1.4 },
};

export default function Toast({ message, icon = "✓", duration = 4000, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  if (!visible) return null;

  return (
    <div style={S.wrapper}>
      <div style={S.toast}>
        <span style={{ ...S.icon, color: "var(--c-accent)" }}>{icon}</span>
        <span style={S.text}>{message}</span>
      </div>
    </div>
  );
}

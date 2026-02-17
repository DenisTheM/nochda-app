import { useState, useEffect } from "react";

const S = {
  toast: {
    position: "fixed", bottom: 100, left: "50%",
    transform: "translateX(-50%) translateY(80px)",
    padding: "14px 28px",
    background: "#12121a",
    border: "1px solid rgba(251,191,36,0.2)",
    borderRadius: 16,
    fontSize: 15, fontWeight: 500, color: "#fbbf24",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(251,191,36,0.06)",
    opacity: 0, pointerEvents: "none",
    transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s",
    zIndex: 100, whiteSpace: "nowrap",
    fontFamily: "var(--font-body)",
  },
  visible: {
    transform: "translateX(-50%) translateY(0)",
    opacity: 1,
  },
};

export default function MilestoneToast({ message, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 500); }, 4000);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div style={{ ...S.toast, ...(visible ? S.visible : {}) }}>
      {message}
    </div>
  );
}

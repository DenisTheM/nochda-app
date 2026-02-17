const S = {
  nav: {
    display: "flex", justifyContent: "space-around",
    padding: "10px 0 24px", borderTop: "1px solid var(--c-border)",
    background: "var(--c-bg)",
  },
  btn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "var(--font-body)", gap: 4, padding: "6px 14px",
    transition: "color 0.2s",
  },
  label: { fontSize: 10, fontWeight: 500, letterSpacing: 0.5 },
};

const icons = {
  home: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  contacts: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  history: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 8v4l2 2"/><circle cx="12" cy="12" r="10"/></svg>,
  settings: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

const NAV = [
  { key: "home", label: "Check-in" },
  { key: "contacts", label: null },
  { key: "history", label: null },
  { key: "settings", label: null },
];

export default function BottomNav({ t, view, setView }) {
  return (
    <div style={S.nav}>
      {NAV.map(({ key, label }) => {
        const active = view === key;
        const color = active ? "#6ee7a0" : "#55556a";
        return (
          <button key={key} onClick={() => setView(key)} style={{ ...S.btn, color }}>
            {icons[key](color)}
            <span style={S.label}>{label || t[key] || key}</span>
          </button>
        );
      })}
    </div>
  );
}

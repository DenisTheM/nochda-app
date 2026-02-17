import { LANGUAGES } from "../i18n/index.js";

const S = {
  row: { display: "flex", justifyContent: "center", gap: 10, marginTop: 20 },
  btn: { padding: "6px 16px", borderRadius: "var(--r-sm)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--c-text)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" },
};

export default function LangSwitcher({ value, onChange }) {
  return (
    <div style={S.row}>
      {LANGUAGES.map((l) => (
        <button key={l} onClick={() => onChange(l)} style={{ ...S.btn, opacity: value === l ? 1 : 0.4, borderColor: value === l ? "var(--c-accent)" : "rgba(255,255,255,0.15)" }}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

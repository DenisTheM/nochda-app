import { useState, useCallback, useRef } from "react";
import PulseRing from "../components/PulseRing.jsx";
import { getToday, calcStreak, getDeadline } from "../lib/utils.js";
import { getTimeGreeting, getSuccessMessage, getMilestone } from "../lib/microcopy.js";

const S = {
  body: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "20px 24px", gap: 16, overflow: "auto",
    position: "relative", zIndex: 1,
  },
  greeting: { textAlign: "center", marginBottom: 12, animation: "fadeSlide 0.8s ease-out both" },
  greetingTime: {
    fontSize: 12, fontWeight: 500, color: "var(--c-text-muted)",
    letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6,
  },
  greetingName: {
    fontFamily: "var(--font-display)", fontSize: "clamp(26px, 7vw, 36px)",
    fontWeight: 400, letterSpacing: -0.5, lineHeight: 1.2,
  },
  nameAccent: { fontStyle: "italic", color: "var(--c-accent)" },
  checkinWrap: {
    position: "relative", width: 200, height: 200,
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "fadeSlide 0.8s ease-out 0.1s both",
  },
  checkinBtn: {
    width: 170, height: 170, borderRadius: "50%", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
    zIndex: 2, WebkitTapHighlightColor: "transparent",
    position: "relative",
  },
  statusMain: {
    fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400,
    minHeight: 32, transition: "all 0.5s ease", textAlign: "center",
  },
  statusSub: {
    fontSize: 14, color: "var(--c-text-muted)", fontWeight: 400,
    lineHeight: 1.5, transition: "all 0.5s ease", textAlign: "center",
    minHeight: 22,
  },
  cards: {
    display: "flex", gap: 12, width: "100%", maxWidth: 360,
    animation: "fadeSlide 0.8s ease-out 0.3s both",
  },
  card: {
    flex: 1, padding: "14px 12px", background: "var(--c-surface)",
    border: "1px solid var(--c-border)", borderRadius: 16,
    textAlign: "center", transition: "border-color 0.3s, transform 0.3s",
  },
  cardIcon: { fontSize: 18, marginBottom: 4 },
  cardVal: { fontSize: 18, fontWeight: 700, marginBottom: 2 },
  cardLabel: { fontSize: 10, color: "var(--c-text-muted)", fontWeight: 500, letterSpacing: 0.5 },
  alert: {
    width: "100%", maxWidth: 380, background: "var(--c-danger-bg)",
    border: "1px solid var(--c-danger-border)", borderRadius: 18,
    padding: "16px 18px", animation: "fadeIn 0.5s ease-out",
  },
  pushBanner: {
    width: "100%", maxWidth: 380, background: "var(--c-accent-bg)",
    border: "1px solid var(--c-accent-border)", borderRadius: "var(--r-md)",
    padding: "12px 16px", color: "var(--c-accent)", fontSize: 14,
    cursor: "pointer", textAlign: "center", fontFamily: "var(--font-body)", fontWeight: 600,
  },
  warning: {
    width: "100%", maxWidth: 380, background: "var(--c-warning-bg)",
    border: "1px solid var(--c-warning-border)", borderRadius: "var(--r-md)",
    padding: "12px 16px", color: "var(--c-warning)", fontSize: 13,
    cursor: "pointer", textAlign: "center", fontFamily: "var(--font-body)",
    border: "none",
  },
};

export default function HomeView({ t, checkins, contacts, profile, pushState, onCheckin, onEnablePush, setView, lang, emitParticles }) {
  const [justChecked, setJustChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const btnRef = useRef(null);

  const todayChecked = checkins.some((c) => c.date === getToday());
  const streak = calcStreak(checkins);
  const deadlineHours = profile?.deadline_hours || 24;
  const { overdue } = getDeadline(checkins, deadlineHours);
  const userName = profile?.name?.split(" ")[0] || "";

  const handleCheckin = useCallback(async () => {
    if (todayChecked) return;
    const result = await onCheckin();
    if (result) {
      setJustChecked(true);
      setSuccessMsg(getSuccessMessage(lang));

      // Emit particles from button position
      if (emitParticles && btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        emitParticles(cx, cy, 50);
        setTimeout(() => emitParticles(cx, cy, 25), 350);
      }
    }
  }, [onCheckin, todayChecked, lang, emitParticles]);

  const isChecked = todayChecked || justChecked;

  const btnBg = isChecked
    ? "linear-gradient(145deg, #d4963a, #b87a28)"
    : overdue
      ? "linear-gradient(145deg, #991b1b, #7f1d1d)"
      : "linear-gradient(145deg, #2a9d5c, #1a7a42)";

  const btnShadow = isChecked
    ? "0 0 60px rgba(249,201,124,0.15), 0 0 120px rgba(249,201,124,0.04)"
    : overdue
      ? "0 0 60px rgba(248,113,113,0.2)"
      : "0 0 60px rgba(110,231,160,0.12), 0 0 120px rgba(110,231,160,0.04)";

  return (
    <div style={S.body}>
      {/* Overdue alert */}
      {overdue && contacts.length > 0 && (
        <div style={S.alert}>
          <div style={{ fontWeight: 700, color: "var(--c-danger)", marginBottom: 4, fontSize: 15 }}>{t.overdue}</div>
          <div style={{ fontSize: 13, color: "#fca5a5", lineHeight: 1.4 }}>{t.overdueMsg}</div>
        </div>
      )}

      {/* Push prompt */}
      {pushState === "prompt" && (
        <button onClick={onEnablePush} style={S.pushBanner}>🔔 {t.pushEnable}</button>
      )}

      {/* Greeting */}
      <div style={S.greeting}>
        <div style={S.greetingTime}>{getTimeGreeting(lang)}</div>
        <div style={S.greetingName}>
          {userName ? <>Hallo <span style={S.nameAccent}>{userName}</span></> : "Noch da?"}
        </div>
      </div>

      {/* Check-in button */}
      <div style={S.checkinWrap}>
        <PulseRing active={!isChecked && !overdue} />
        <button
          ref={btnRef}
          onClick={handleCheckin}
          disabled={isChecked}
          style={{
            ...S.checkinBtn,
            background: btnBg,
            boxShadow: btnShadow,
            transform: justChecked ? "scale(0.95)" : "scale(1)",
          }}
        >
          {isChecked ? (
            <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
              <path d="M14 25l8 8 12-14" stroke="rgba(255,255,255,0.95)" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                style={justChecked ? { strokeDasharray: 36, strokeDashoffset: 36, animation: "checkmark 0.5s ease-out 0.15s forwards" } : {}}
              />
            </svg>
          ) : overdue ? (
            <span style={{ fontSize: 40, fontWeight: 700, color: "#fca5a5" }}>!</span>
          ) : (
            <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <circle cx="24" cy="24" r="6" fill="rgba(255,255,255,0.9)" />
            </svg>
          )}
        </button>
      </div>

      {/* Status text */}
      <div style={{ textAlign: "center", animation: "fadeSlide 0.8s ease-out 0.2s both" }}>
        <div style={{ ...S.statusMain, color: isChecked ? "var(--c-warm)" : "var(--c-text)" }}>
          {isChecked ? (successMsg?.main || "Noch da. 💛") : (overdue ? t.overdue : "Noch da?")}
        </div>
        <div style={S.statusSub}>
          {isChecked ? (successMsg?.sub || "Schön, dass du da bist.") : "Ein Tap und dein Tag beginnt gut."}
        </div>
      </div>

      {/* Info cards */}
      <div style={S.cards}>
        <div style={S.card}>
          <div style={S.cardIcon}>👤</div>
          <div style={S.cardVal}>{contacts.length}</div>
          <div style={S.cardLabel}>{contacts.length === 1 ? "Kontakt" : "Kontakte"}</div>
        </div>
        <div style={S.card}>
          <div style={S.cardIcon}>🔥</div>
          <div style={{ ...S.cardVal, color: streak > 0 ? "var(--c-gold)" : undefined }}>{streak}</div>
          <div style={S.cardLabel}>Streak</div>
        </div>
        <div style={S.card}>
          <div style={S.cardIcon}>✓</div>
          <div style={S.cardVal}>{checkins.length}</div>
          <div style={S.cardLabel}>Check-ins</div>
        </div>
      </div>

      {/* No contacts warning */}
      {contacts.length === 0 && (
        <button onClick={() => setView("contacts")} style={S.warning}>⚠ {t.noContacts}</button>
      )}
    </div>
  );
}

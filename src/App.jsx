import { useState, useCallback, useRef } from "react";
import { getTranslation } from "./i18n/index.js";
import { useAuth } from "./hooks/useAuth.js";
import { useAppData } from "./hooks/useAppData.js";
import { calcStreak } from "./lib/utils.js";
import { getMilestone } from "./lib/microcopy.js";
import * as api from "./lib/api.js";
import AuthView from "./views/AuthView.jsx";
import HomeView from "./views/HomeView.jsx";
import ContactsView from "./views/ContactsView.jsx";
import ContactFormView from "./views/ContactFormView.jsx";
import HistoryView from "./views/HistoryView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import PaywallView from "./views/PaywallView.jsx";
import PlanPickerView from "./views/PlanPickerView.jsx";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Toast from "./components/Toast.jsx";
import TrialBanner from "./components/TrialBanner.jsx";
import Particles from "./components/Particles.jsx";
import MilestoneToast from "./components/MilestoneToast.jsx";

const S = {
  screen: {
    display: "flex", flexDirection: "column", height: "100vh",
    background: "var(--c-bg)", color: "var(--c-text)",
    fontFamily: "var(--font-body)", overflow: "hidden",
    position: "relative",
  },
  loading: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", flex: 1, gap: 16,
  },
  loadingDot: {
    width: 16, height: 16, borderRadius: "50%",
    background: "var(--c-accent)", animation: "breathe 2s ease-in-out infinite",
    boxShadow: "0 0 30px rgba(110,231,160,0.2)",
  },
  loadingText: {
    fontFamily: "var(--font-display)", fontSize: 20,
    color: "var(--c-text-muted)", fontStyle: "italic",
  },
};

export default function App() {
  const { user, loading } = useAuth();
  const data = useAppData(user);
  const [view, setView] = useState("home");
  const [editingContact, setEditingContact] = useState(null);
  const [toast, setToast] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const emitRef = useRef(null);

  const t = getTranslation(data.lang);
  const streak = calcStreak(data.checkins);

  const showToast = useCallback((message, icon) => {
    setToast({ message, icon: icon || "✓", key: Date.now() });
  }, []);

  const handleUpgrade = useCallback(() => setShowPlanPicker(true), []);
  const handlePlanSelect = useCallback(async (plan) => {
    const { url } = await api.createCheckout(plan);
    if (url) window.location.href = url;
  }, []);

  const emitParticles = useCallback((x, y, count, colors) => {
    if (emitRef.current) emitRef.current(x, y, count, colors);
  }, []);

  if (loading) {
    return (
      <div style={S.screen}>
        <div style={S.loading}>
          <div style={S.loadingDot} />
          <div style={S.loadingText}>nochda</div>
        </div>
      </div>
    );
  }

  if (!user) return <AuthView t={t} lang={data.lang} setLang={data.setLang} />;

  if (!data.isActive && data.profile && !showPlanPicker) {
    return <PaywallView t={t} onUpgrade={handleUpgrade} onSignOut={() => api.signOut()} />;
  }

  if (showPlanPicker) {
    return <PlanPickerView onSelect={handlePlanSelect} onCancel={() => setShowPlanPicker(false)} />;
  }

  if (view === "addContact" || view === "editContact") {
    return (
      <>
        <ContactFormView t={t} initial={editingContact}
          onSave={async (c) => {
            if (editingContact) {
              await data.editContact(editingContact.id, c);
              showToast(t.toastContactUpdated, "✓");
            } else {
              await data.addContact(c);
              showToast(t.toastContactSaved, "✉");
            }
            setEditingContact(null); setView("contacts");
          }}
          onDelete={editingContact ? async () => {
            await data.removeContact(editingContact.id);
            setEditingContact(null); setView("contacts");
            showToast(t.toastContactDeleted, "🗑");
          } : null}
          onCancel={() => { setEditingContact(null); setView("contacts"); }}
        />
        {toast && <Toast key={toast.key} message={toast.message} icon={toast.icon} onDone={() => setToast(null)} />}
      </>
    );
  }

  if (view === "settings") {
    return (
      <>
        <SettingsView t={t} profile={data.profile} pushState={data.pushState} onEnablePush={data.enablePush}
          onSave={async (u) => { await data.saveProfile(u); setView("home"); showToast(t.toastSettingsSaved, "⚙"); }}
          onCancel={() => setView("home")}
        />
        {toast && <Toast key={toast.key} message={toast.message} icon={toast.icon} onDone={() => setToast(null)} />}
      </>
    );
  }

  return (
    <div style={S.screen}>
      <Particles emitRef={emitRef} />
      <Header t={t} view={view} setView={setView} streak={streak} />
      <TrialBanner daysLeft={data.daysLeft} isActive={data.isActive} onUpgrade={handleUpgrade} />
      {view === "home" && (
        <HomeView t={t} checkins={data.checkins} contacts={data.contacts} profile={data.profile}
          pushState={data.pushState} lang={data.lang}
          emitParticles={emitParticles}
          onCheckin={async () => {
            const result = await data.checkin();
            if (result) {
              const newStreak = streak + 1;
              const m = getMilestone(newStreak, data.lang);
              if (m) setTimeout(() => {
                setMilestone(m);
                // Extra confetti for milestones
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                const colors = ["#fbbf24", "#f9c97c", "#6ee7a0", "#f87171", "#818cf8", "#f0ece6"];
                emitParticles(cx, cy - 50, 80, colors);
                emitParticles(cx - 80, cy, 40, colors);
                emitParticles(cx + 80, cy, 40, colors);
              }, 1200);
            }
            return result;
          }}
          onEnablePush={data.enablePush} setView={setView}
        />
      )}
      {view === "contacts" && (
        <ContactsView t={t} contacts={data.contacts}
          onEdit={(c) => { setEditingContact(c); setView("editContact"); }}
          onAdd={() => setView("addContact")}
        />
      )}
      {view === "history" && <HistoryView t={t} checkins={data.checkins} />}
      <BottomNav t={t} view={view} setView={setView} />
      {toast && <Toast key={toast.key} message={toast.message} icon={toast.icon} onDone={() => setToast(null)} />}
      <MilestoneToast message={milestone} onDone={() => setMilestone(null)} />
    </div>
  );
}

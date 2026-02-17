const greetings = {
  de: {
    night:     "Gute Nacht",
    morning:   "Guten Morgen",
    midday:    "Mahlzeit",
    afternoon: "Guten Nachmittag",
    evening:   "Guten Abend",
  },
  en: {
    night:     "Good Night",
    morning:   "Good Morning",
    midday:    "Good Afternoon",
    afternoon: "Good Afternoon",
    evening:   "Good Evening",
  },
  fr: {
    night:     "Bonne nuit",
    morning:   "Bonjour",
    midday:    "Bon après-midi",
    afternoon: "Bon après-midi",
    evening:   "Bonsoir",
  },
};

export function getTimeGreeting(lang = "de") {
  const h = new Date().getHours();
  const g = greetings[lang] || greetings.de;
  if (h < 5) return g.night;
  if (h < 11) return g.morning;
  if (h < 14) return g.midday;
  if (h < 18) return g.afternoon;
  if (h < 22) return g.evening;
  return g.night;
}

const successMessages = {
  de: [
    { main: "Noch da. 💛", sub: "Schön, dass du da bist." },
    { main: "Noch da. 💛", sub: "Dein Kontakt weiss Bescheid." },
    { main: "Noch da. 💛", sub: "Ein guter Tag beginnt jetzt." },
    { main: "Noch da. 💛", sub: "Du bist nicht allein." },
    { main: "Noch da. 💛", sub: "Jemand denkt heute an dich." },
    { main: "Noch da. 💛", sub: "Dein Sicherheitsnetz ist aktiv." },
  ],
  en: [
    { main: "Still here. 💛", sub: "Glad you're here." },
    { main: "Still here. 💛", sub: "Your contact knows." },
    { main: "Still here. 💛", sub: "A good day starts now." },
    { main: "Still here. 💛", sub: "You're not alone." },
    { main: "Still here. 💛", sub: "Someone thinks of you today." },
  ],
  fr: [
    { main: "Encore là. 💛", sub: "Content que tu sois là." },
    { main: "Encore là. 💛", sub: "Ton contact est informé." },
    { main: "Encore là. 💛", sub: "Tu n'es pas seul·e." },
  ],
};

export function getSuccessMessage(lang = "de") {
  const msgs = successMessages[lang] || successMessages.de;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

const milestoneMessages = {
  de: {
    7: "🎉 Eine Woche geschafft!",
    14: "⭐ Zwei Wochen — toll!",
    30: "✨ Ein ganzer Monat! Du bist Gold wert.",
    50: "🌟 50 Tage — beeindruckend!",
    100: "🏆 100 Tage — Wahnsinn!",
    365: "💛 Ein ganzes Jahr. Unglaublich.",
  },
  en: {
    7: "🎉 One week done!",
    30: "✨ A whole month! You're golden.",
    100: "🏆 100 days — amazing!",
    365: "💛 A whole year. Incredible.",
  },
  fr: {
    7: "🎉 Une semaine!",
    30: "✨ Un mois entier!",
    100: "🏆 100 jours!",
  },
};

export function getMilestone(streak, lang = "de") {
  const m = milestoneMessages[lang] || milestoneMessages.de;
  return m[streak] || null;
}

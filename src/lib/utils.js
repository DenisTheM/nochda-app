export function getToday() { return new Date().toISOString().slice(0, 10); }
export function getYesterday() { return new Date(Date.now() - 86400000).toISOString().slice(0, 10); }

export function calcStreak(checkins) {
  if (!checkins?.length) return 0;
  const dates = checkins.map((c) => c.date).sort((a, b) => b.localeCompare(a));
  const today = getToday(), yesterday = getYesterday();
  if (dates[0] !== today && dates[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    if ((new Date(dates[i - 1]) - new Date(dates[i])) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}

export function getDeadline(checkins, deadlineHours) {
  if (!checkins?.length) return { overdue: false, str: "—", hoursLeft: deadlineHours };
  const latest = checkins.reduce((a, b) => (a.checked_at > b.checked_at ? a : b));
  const deadline = new Date(new Date(latest.checked_at).getTime() + deadlineHours * 3600000);
  const hoursLeft = (deadline - new Date()) / 3600000;
  return {
    overdue: hoursLeft < 0,
    str: deadline.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    hoursLeft: Math.max(0, hoursLeft),
  };
}

export function timeAgo(dateStr, t) {
  const today = getToday(), yesterday = getYesterday();
  if (dateStr === today) return t.today;
  if (dateStr === yesterday) return t.yesterday;
  return Math.floor((new Date(today) - new Date(dateStr)) / 86400000) + " " + t.daysAgo;
}

import HabitLog from "../models/HabitLog.js";

/**
 * Normalizes any date to midnight UTC so day comparisons are consistent
 * regardless of the time portion supplied.
 */
export const toMidnightUTC = (date = new Date()) => {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Recalculates current & longest streak for a habit based on its logs.
 * Only meaningful for daily-frequency habits; weekly/monthly habits use
 * a looser "any completion in period" streak definition.
 *
 * @param {string} habitId
 * @param {string} frequency - "daily" | "weekly" | "monthly"
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
export const calculateStreaks = async (habitId, frequency = "daily") => {
  const logs = await HabitLog.find({ habit: habitId, completed: true })
    .sort({ date: 1 })
    .select("date -_id");

  if (logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dates = logs.map((log) => toMidnightUTC(log.date).getTime());
  const uniqueDates = [...new Set(dates)].sort((a, b) => a - b);

  // Step size in ms between consecutive completions that still counts as "in a row"
  const stepMs =
    frequency === "weekly"
      ? 7 * ONE_DAY_MS
      : frequency === "monthly"
      ? 28 * ONE_DAY_MS // approximate; monthly streaks are inherently fuzzy
      : ONE_DAY_MS;

  let longestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = uniqueDates[i] - uniqueDates[i - 1];
    if (diff <= stepMs) {
      currentRun += 1;
    } else {
      currentRun = 1;
    }
    longestStreak = Math.max(longestStreak, currentRun);
  }

  // Determine current streak: only "alive" if the most recent completion
  // is today or within one step of today, otherwise the streak is broken.
  const today = toMidnightUTC().getTime();
  const lastDate = uniqueDates[uniqueDates.length - 1];
  const gapFromToday = today - lastDate;

  let currentStreak = 0;
  if (gapFromToday <= stepMs) {
    currentStreak = 1;
    for (let i = uniqueDates.length - 1; i > 0; i--) {
      const diff = uniqueDates[i] - uniqueDates[i - 1];
      if (diff <= stepMs) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
};

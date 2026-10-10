import asyncHandler from "express-async-handler";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import { calculateStreaks, toMidnightUTC } from "../utils/streak.js";

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
// @access  Private
export const getHabits = asyncHandler(async (req, res) => {
  const { archived = "false" } = req.query;

  const habits = await Habit.find({
    user: req.user._id,
    archived: archived === "true",
  }).sort({ createdAt: -1 });

  // Attach "completedToday" flag for each habit so the UI can render checkboxes
  const todayStart = toMidnightUTC();
  const habitIds = habits.map((h) => h._id);

  const todaysLogs = await HabitLog.find({
    habit: { $in: habitIds },
    date: todayStart,
    completed: true,
  }).select("habit");

  const completedTodaySet = new Set(todaysLogs.map((l) => l.habit.toString()));

  const habitsWithStatus = habits.map((h) => ({
    ...h.toObject(),
    completedToday: completedTodaySet.has(h._id.toString()),
  }));

  res.status(200).json({ success: true, count: habits.length, habits: habitsWithStatus });
});

// @desc    Get a single habit
// @route   GET /api/habits/:id
// @access  Private
export const getHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  res.status(200).json({ success: true, habit });
});

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = asyncHandler(async (req, res) => {
  const { name, goal, color, icon, reminderTime, frequency, weeklyDays } = req.body;

  const habit = await Habit.create({
    user: req.user._id,
    name,
    goal,
    color,
    icon,
    reminderTime,
    frequency,
    weeklyDays,
  });

  res.status(201).json({ success: true, habit });
});

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  const allowedFields = [
    "name",
    "goal",
    "color",
    "icon",
    "reminderTime",
    "frequency",
    "weeklyDays",
    "archived",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      habit[field] = req.body[field];
    }
  });

  await habit.save();

  res.status(200).json({ success: true, habit });
});

// @desc    Delete a habit (and its logs)
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  await HabitLog.deleteMany({ habit: habit._id });

  res.status(200).json({ success: true, message: "Habit deleted" });
});

// @desc    Toggle today's completion for a habit (check/uncheck)
// @route   POST /api/habits/:id/check
// @access  Private
export const checkHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  // Allow logging for an arbitrary date (e.g. from the calendar view),
  // defaulting to today.
  const targetDate = toMidnightUTC(req.body.date ? new Date(req.body.date) : new Date());

  const existingLog = await HabitLog.findOne({ habit: habit._id, date: targetDate });

  if (existingLog) {
    // Toggle off: remove the log entry
    await existingLog.deleteOne();
  } else {
    await HabitLog.create({
      habit: habit._id,
      user: req.user._id,
      date: targetDate,
      completed: true,
    });
  }

  const { currentStreak, longestStreak } = await calculateStreaks(
    habit._id,
    habit.frequency
  );

  habit.currentStreak = currentStreak;
  habit.longestStreak = Math.max(habit.longestStreak, longestStreak);
  await habit.save();

  res.status(200).json({
    success: true,
    completedToday: !existingLog,
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
  });
});

// @desc    Get completion history for a habit (for calendar heatmap view)
// @route   GET /api/habits/:id/history
// @access  Private
export const getHabitHistory = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  const { from, to } = req.query;

  const query = { habit: habit._id, completed: true };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = toMidnightUTC(new Date(from));
    if (to) query.date.$lte = toMidnightUTC(new Date(to));
  }

  const logs = await HabitLog.find(query).sort({ date: 1 }).select("date note -_id");

  const completionRate =
    logs.length > 0
      ? Math.round(
          (logs.length /
            Math.max(
              1,
              Math.ceil(
                (Date.now() - new Date(habit.createdAt).getTime()) /
                  (24 * 60 * 60 * 1000)
              )
            )) *
            100
        )
      : 0;

  res.status(200).json({
    success: true,
    habit: {
      id: habit._id,
      name: habit.name,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
    },
    completionRate,
    logs,
  });
});

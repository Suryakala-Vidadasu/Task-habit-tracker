import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Normalized to midnight UTC of the day being logged, so each habit
    // can have at most one log entry per calendar day.
    date: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate log entries for the same habit on the same day
habitLogSchema.index({ habit: 1, date: 1 }, { unique: true });
habitLogSchema.index({ user: 1, date: -1 });

const HabitLog = mongoose.model("HabitLog", habitLogSchema);

export default HabitLog;

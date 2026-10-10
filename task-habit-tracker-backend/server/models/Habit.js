import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      maxlength: [100, "Habit name cannot exceed 100 characters"],
    },
    goal: {
      type: String,
      trim: true,
      default: "",
    },
    color: {
      type: String,
      default: "#6366f1", // indigo-500 default accent
    },
    icon: {
      type: String,
      default: "Star", // lucide-react icon name
    },
    reminderTime: {
      type: String, // stored as "HH:mm"
      default: null,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    // Only relevant for weekly frequency: 0 (Sun) - 6 (Sat)
    weeklyDays: {
      type: [Number],
      default: [],
    },
    archived: {
      type: Boolean,
      default: false,
    },
    // Denormalized streak data for fast dashboard reads.
    // Recomputed whenever a HabitLog is created/removed for this habit.
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

habitSchema.index({ user: 1, createdAt: -1 });

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;

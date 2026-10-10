import express from "express";
import { body } from "express-validator";
import {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  checkHabit,
  getHabitHistory,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect);

const habitValidation = [
  body("name").trim().notEmpty().withMessage("Habit name is required"),
  body("frequency")
    .optional()
    .isIn(["daily", "weekly", "monthly"])
    .withMessage("Frequency must be daily, weekly, or monthly"),
];

router.route("/").get(getHabits).post(habitValidation, validate, createHabit);

router
  .route("/:id")
  .get(getHabit)
  .put(habitValidation, validate, updateHabit)
  .delete(deleteHabit);

router.post("/:id/check", checkHabit);
router.get("/:id/history", getHabitHistory);

export default router;

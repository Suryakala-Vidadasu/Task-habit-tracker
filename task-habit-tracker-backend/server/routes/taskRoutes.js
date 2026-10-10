import express from "express";
import { body } from "express-validator";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// All task routes require authentication
router.use(protect);

const taskCreateValidation = [
  body("title").trim().notEmpty().withMessage("Task title is required"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("dueDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

const taskUpdateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Task title cannot be empty"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("dueDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

router.route("/").get(getTasks).post(taskCreateValidation, validate, createTask);

router
  .route("/:id")
  .get(getTask)
  .put(taskUpdateValidation, validate, updateTask)
  .delete(deleteTask);

export default router;

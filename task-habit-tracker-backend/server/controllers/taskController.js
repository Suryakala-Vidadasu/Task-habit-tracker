import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";

// @desc    Get all tasks for logged-in user (search, filter, sort, paginate)
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const {
    search = "",
    priority,
    completed,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  const query = { user: req.user._id };

  if (search) {
    query.$text = { $search: search };
  }

  if (priority && ["low", "medium", "high"].includes(priority)) {
    query.priority = priority;
  }

  if (completed === "true" || completed === "false") {
    query.completed = completed === "true";
  }

  const sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(query).sort(sortOptions).skip(skip).limit(limitNum),
    Task.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    tasks,
  });
});

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json({ success: true, task });
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, tags } = req.body;

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    priority,
    dueDate,
    tags,
  });

  res.status(201).json({ success: true, task });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const allowedFields = [
    "title",
    "description",
    "priority",
    "dueDate",
    "completed",
    "tags",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  await task.save();

  res.status(200).json({ success: true, task });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json({ success: true, message: "Task deleted" });
});

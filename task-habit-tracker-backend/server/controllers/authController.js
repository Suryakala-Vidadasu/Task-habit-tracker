import asyncHandler from "express-async-handler";
import crypto from "crypto";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import { sendTokenCookie } from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });

  const token = sendTokenCookie(res, user._id, false);

  res.status(201).json({
    success: true,
    token,
    user,
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Explicitly select password since schema excludes it by default
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = sendTokenCookie(res, user._id, !!rememberMe);

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json({ success: true, user: req.user });
});

// @desc    Request a password reset (placeholder - would email a reset link)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way whether or not the user exists,
  // to avoid leaking which emails are registered.
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // TODO: integrate an email provider (e.g. Nodemailer + SendGrid/SES)
    // and send `resetToken` via a reset link like:
    // `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    console.log(`Password reset requested for ${email}. Token: ${resetToken}`);
  }

  res.status(200).json({
    success: true,
    message: "If that email is registered, a reset link has been sent.",
  });
});

// @desc    Reset password using token (placeholder implementation)
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    res.status(400);
    throw new Error("Reset token is invalid or has expired");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful, please log in",
  });
});

// @desc    Update current user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
  if (req.body.theme !== undefined) user.theme = req.body.theme;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// @desc    Delete user account and all associated data
// @route   DELETE /api/auth/me
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Promise.all([
    Task.deleteMany({ user: userId }),
    Habit.deleteMany({ user: userId }),
    HabitLog.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

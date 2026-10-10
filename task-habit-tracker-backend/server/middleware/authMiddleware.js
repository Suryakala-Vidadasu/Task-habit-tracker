import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

/**
 * Protects routes by verifying the JWT sent either as an httpOnly cookie
 * or as a Bearer token in the Authorization header.
 * Attaches the authenticated user to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    // Distinguish expired tokens so the frontend can redirect to login cleanly
    if (error.name === "TokenExpiredError") {
      throw new Error("Session expired, please login again");
    }
    throw new Error("Not authorized, token invalid");
  }
});

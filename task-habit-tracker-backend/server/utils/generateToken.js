import jwt from "jsonwebtoken";

/**
 * Generates a signed JWT for the given user id.
 * @param {string} userId - Mongo ObjectId of the user
 * @returns {string} signed JWT
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Signs a JWT and sets it as an httpOnly cookie on the response.
 * Also returns the token in case the client needs it (e.g., for mobile clients).
 * @param {import('express').Response} res
 * @param {string} userId
 * @param {boolean} rememberMe - extends cookie lifetime when true
 */
export const sendTokenCookie = (res, userId, rememberMe = false) => {
  const token = generateToken(userId);

  const cookieDays = rememberMe
    ? Number(process.env.JWT_COOKIE_EXPIRES_IN || 7) * 4 // longer lived if "remember me"
    : Number(process.env.JWT_COOKIE_EXPIRES_IN || 7);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
  };

  res.cookie("token", token, cookieOptions);

  return token;
};

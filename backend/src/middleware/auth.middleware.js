import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../common/errors/ApiError.js";

export const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(
        401,
        "UNAUTHORIZED",
        "Access denied. Missing or invalid authorization header."
      )
    );
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: decoded.userId,
    };
    return next();
  } catch (err) {
    return next(new ApiError(401, "UNAUTHORIZED", "Invalid or expired token."));
  }
};

// Optional auth - doesn't fail if no token, but sets req.user if valid token is present
export const optionalAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // Continue without setting req.user
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: decoded.userId,
    };
    return next();
  } catch (err) {
    // If token is invalid, continue without setting req.user (don't fail)
    return next();
  }
};

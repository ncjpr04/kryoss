import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { authService } from "./auth.service.js";
import { ApiError } from "../../common/errors/ApiError.js";

const signAccessToken = (user) => {
  const payload = {
    userId: user.id,
    type: "access",
  };

  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtAccessTokenExpiry });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.createUser({ name, email, password });
    const accessToken = signAccessToken(user);

    return res.status(201).json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    const ok = await authService.validatePassword(user, password);
    if (!ok) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    const accessToken = signAccessToken(user);

    return res.status(200).json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "UNAUTHORIZED", "Not authenticated.");
    }

    const user = await authService.getUserById(userId);
    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "User not found.");
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    return next(err);
  }
};

export const authController = {
  register,
  login,
  me,
};

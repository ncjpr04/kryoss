import bcrypt from "bcrypt";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../common/errors/ApiError.js";

const SALT_ROUNDS = 10;

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const createUser = async ({ name, email, password }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, "USER_EXISTS", "User already exists with this email.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });

  return user;
};

const validatePassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

export const authService = {
  findUserByEmail,
  getUserById,
  createUser,
  validatePassword,
};

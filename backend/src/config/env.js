import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "PORT"];

const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn(
    `Missing required environment variables: ${missing.join(
      ", "
    )}. Some features may not work correctly until they are set.`
  );
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || "7d", // 7 days
};

export default env;

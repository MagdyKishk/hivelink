import dotenv from "dotenv";

dotenv.config();

const jwtConfig = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "SECRET_!@#",
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "SECRET_!#@",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "",
} as const;

export default jwtConfig;

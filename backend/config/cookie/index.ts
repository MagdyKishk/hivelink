import dotenv from "dotenv";

dotenv.config();

const cookieConfig = {
  COOKIES_SECRET: process.env.COOKIES_SECRET || ""
} as const;

export default cookieConfig;
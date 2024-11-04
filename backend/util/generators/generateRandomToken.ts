import crypto from "crypto";

export default function generateRandomToken(length: number = 6): string {
  return crypto
    .randomBytes(Math.max(Math.round(length / 2), 2))
    .toString("hex");
}

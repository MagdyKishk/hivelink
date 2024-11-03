import crypto from "crypto";

export default function generateUserName(): string {
  return "User-" + crypto.randomBytes(4).toString("hex");
}

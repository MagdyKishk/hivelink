import mongoose from "mongoose";
import type { EmailDocument, EmailModel } from "./types/email.types";
import validator from "../validator";
import generateRandomToken from "../util/generators/generateRandomToken";

const emailSchema = new mongoose.Schema<EmailDocument, EmailModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      match: validator.email.regex.address,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      default: () => generateRandomToken(6),
    },
    verifyCodeExpireDate: {
      type: Date,
      default: () => Date.now() + 1000 * 60 * 30,
    },
    deletionDate: {
      type: Date,
      default: undefined
    },
  },
  {
    timestamps: true,
    statics: {
      validateAddress(address: string) {
        return validator.email.regex.address.test(address);
      },
    },
    methods: {
      async generateNewToken() {
        if (!this.verified) {
          const newToken = generateRandomToken(6);
          this.verifyCode = newToken;
          this.verifyCodeExpireDate = new Date(
            Date.now() + 1000 * 60 * 30
          );
          await this.save();
        }
      },
    },
  }
);

export const Email = mongoose.model<EmailDocument, EmailModel>(
  "Email",
  emailSchema
);

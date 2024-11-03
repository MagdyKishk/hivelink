import mongoose from "mongoose";
import validator from "../validator";
import type { PasswordDocument, PasswordModel } from "./types/password.types";
import bcryptjs from "bcryptjs";

const passwordSchema = new mongoose.Schema<PasswordDocument, PasswordModel>(
  {
    hash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,

    statics: {
      async validatePassword(password: string) {
        return validator.password.regex.password.test(password);
      },
      async hashPassword(password: string) {
        return await bcryptjs.hash(password, 10);
      },
    },

    methods: {
      async compare(password: string) {
        await bcryptjs.compare(password, this.hash as string);
      },
    },
  }
);

export const Password = mongoose.model<PasswordDocument, PasswordModel>(
  "Password",
  passwordSchema
);

import mongoose, { Document } from "mongoose";

interface PasswordDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  hash: String;

  compare: (password: string) => Promise<Boolean>;
}

interface PasswordModel extends mongoose.Model<PasswordDocument> {
  validatePassword: (password: string) => boolean;
  hashPassword: (password: string) => Promise<string>;
}

export type { PasswordDocument, PasswordModel };

import mongoose, { Document } from "mongoose";

interface EmailDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  userId: mongoose.Schema.Types.ObjectId;
  address: string;
  verified: boolean;
  verifyCode?: string;
  verifyCodeExpireDate?: Date;
  deletionDate?: Date;
  generateNewToken: () => void | Promise<void>;
}

interface EmailModel extends mongoose.Model<EmailDocument> {
  validateAddress: (address: string) => boolean;
}

export type { EmailDocument, EmailModel };

import mongoose, { Document } from "mongoose";

interface JwtTokenDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  value: string;
  expiresDate: Date;
}

interface JwtTokenModel extends mongoose.Model<JwtTokenDocument> {
  createAccessToken: (
    userId: mongoose.Schema.Types.ObjectId
  ) => Promise<JwtTokenDocument>;
  createRefreshToken: (
    userId: mongoose.Schema.Types.ObjectId
  ) => Promise<JwtTokenDocument>;
}

export type { JwtTokenDocument, JwtTokenModel };

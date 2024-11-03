import mongoose, { Document } from "mongoose";

interface UserDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  firstName: string;
  lastName: string;
  username: string;

  emails: mongoose.Schema.Types.ObjectId[];
  passwords: {
    history: mongoose.Schema.Types.ObjectId[];
    current: mongoose.Schema.Types.ObjectId;
  };

  dreams: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  reactions: {
    likes: mongoose.Schema.Types.ObjectId[];
    dislikes: mongoose.Schema.Types.ObjectId[];
  };

  tokens: {
    access: mongoose.Schema.Types.ObjectId[];
    refresh: mongoose.Schema.Types.ObjectId[];
  };

  modifyUser: (
    firstName?: string,
    lastName?: string,
    username?: string
  ) => Promise<void>;
}

interface UserModel extends mongoose.Model<UserDocument> {
  validateFirstName: (firstName: string) => boolean;
  validateLastName: (lastName: string) => boolean;
}

export type { UserDocument, UserModel };

import mongoose, { Document } from "mongoose";

interface DreamDocument extends Document {
  author: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  content: string;
  reactions: {
    likes: mongoose.Schema.Types.ObjectId[];
    dislikes: mongoose.Schema.Types.ObjectId[];
    comment: mongoose.Schema.Types.ObjectId[];
  };
}

interface DreamModel extends mongoose.Model<DreamDocument> {}

export { DreamDocument, DreamModel };

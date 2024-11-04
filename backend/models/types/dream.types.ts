import mongoose, { Document } from "mongoose";

interface DreamDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
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

interface DreamModel extends mongoose.Model<DreamDocument> {
  validateAuthor: (author: string) => boolean;
  validateTitle: (title: string) => boolean;
  validateDescription: (description: string) => boolean;
  validateContent: (content: string) => boolean;
}

export { DreamDocument, DreamModel };

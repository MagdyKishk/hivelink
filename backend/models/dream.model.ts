import mongoose from "mongoose";
import { DreamDocument, DreamModel } from "./types/dream.types";
import validator from "../validator";

const dreamSchema = new mongoose.Schema<DreamDocument>({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    match: validator.dream.regex.title,
  },
  description: {
    type: String,
    match: validator.dream.regex.description,
  },
  content: {
    type: String,
    match: validator.dream.regex.content,
  },
  reactions: {
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    dislikes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    comment: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
    },
  },
});

export const Dream = mongoose.model<DreamDocument, DreamModel>(
  "Dream",
  dreamSchema
);

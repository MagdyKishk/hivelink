import mongoose from "mongoose";
import { generateUserName } from "../util";
import type { UserDocument, UserModel } from "./types/user.types";
import validator from "../validator";

const userSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    firstName: {
      type: String,
      match: validator.user.regex.firstName,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      match: validator.user.regex.lastName,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      match: validator.user.regex.userName,
      default: () => generateUserName(),
      required: true,
    },
    emails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Email",
        required: true,
      },
    ],
    passwords: {
      history: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Password",
          required: true,
        },
      ],
      current: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Password",
        required: true,
      },
    },
    tokens: {
      access: { type: [mongoose.Schema.Types.ObjectId], default: [] },
      refresh: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    },
    dreams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dream",
        default: [],
      },
    ],
    reactions: {
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dream",
        },
      ],
      dislikes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dream",
        },
      ],
      comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
    },
  },
  {
    timestamps: true,

    statics: {
      validateFirstName(firstName: string) {
        return validator.user.regex.firstName.test(firstName);
      },
      validateLastName(lastName: string) {
        return validator.user.regex.lastName.test(lastName);
      },
    },

    methods: {
      async modifyUser(
        firstName?: string,
        lastName?: string,
        username?: string
      ) {
        if (firstName) {
          this.firstName = firstName;
        }
        if (lastName) {
          this.lastName = lastName;
        }
        if (username) {
          this.username = username;
        }

        if (firstName || lastName || username) {
          await this.save();
        }
      },
    },
  }
);

export const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

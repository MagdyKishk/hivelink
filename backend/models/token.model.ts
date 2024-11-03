import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config";
import { getDateFromPeriodString } from "../util";
import type { JwtTokenDocument, JwtTokenModel } from "./types/token.model";

const jwtTokenSchema = new mongoose.Schema<JwtTokenDocument>(
  {
    value: { type: String, required: true },
    expiresDate: { type: Date, required: true },
  },
  {
    statics: {
      async createAccessToken(userId: mongoose.Schema.Types.ObjectId) {
        const token = jwt.sign(
          { userId: userId.toString() },
          jwtConfig.JWT_ACCESS_SECRET,
          {
            expiresIn: jwtConfig.JWT_ACCESS_EXPIRES,
          }
        );
        const expiresData = new Date(
          Date.now() + (getDateFromPeriodString(jwtConfig.JWT_ACCESS_EXPIRES) || 0)
        );

        const tokenDocument = new this({
          value: token,
          expiresDate: expiresData,
        });

        await tokenDocument.save();
        return tokenDocument;
      },

      async createRefreshToken(userId: mongoose.Schema.Types.ObjectId) {
        const token = jwt.sign(
          { userId: userId.toString() },
          jwtConfig.JWT_REFRESH_SECRET,
          {
            expiresIn: jwtConfig.JWT_REFRESH_EXPIRES,
          }
        );
        const expiresData = new Date(
          Date.now() + (getDateFromPeriodString(jwtConfig.JWT_REFRESH_EXPIRES) || 0)
        );

        const tokenDocument = new this({
          value: token,
          expiresDate: expiresData,
        });

        await tokenDocument.save();
        return tokenDocument;
      },
    },
  }
);

jwtTokenSchema.index({ expiresDate: 1 }, { 
  background: true,
  expireAfterSeconds: 0 
});

export const JwtToken = mongoose.model<JwtTokenDocument, JwtTokenModel>(
  "JwtToken",
  jwtTokenSchema
);

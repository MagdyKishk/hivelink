import { Response } from "express";
import { AuthedRequest } from "../../../middleware/auth/checkAuth";
import mongoose from "mongoose";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";
import Logger from "../../../util/logger";
import { enviromentConfig } from "../../../config";
import { Dream } from "../../../models/dream.model";

interface LikeDreamRequest extends AuthedRequest {
  body: {
    dreamId?: string;
  };
}

export default async (req: LikeDreamRequest, res: Response) => {
  const { dreamId } = req.body;
  const currentUser = req.user;

  if (!(dreamId && mongoose.Types.ObjectId.isValid(dreamId))) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.REACTION.INVALID_DREAM_ID,
    });
    return;
  }

  try {
    // get target dream
    const targetDream = await Dream.findById(dreamId);

    if (!targetDream) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.REACTION.INVALID_DREAM_ID,
      });
      return;
    }

    // check if already liked
    if (targetDream.reactions.likes.includes(currentUser._id)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.REACTION.ALREADY_LIKED,
      });
      return;
    }

    // check if user disliked it
    if (targetDream.reactions.dislikes.includes(currentUser._id)) {
      targetDream.reactions.dislikes = targetDream.reactions.dislikes.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
      currentUser.reactions.dislikes = currentUser.reactions.dislikes.filter(
        (id) => id.toString() !== targetDream._id.toString()
      );
    }

    targetDream.reactions.likes.push(currentUser._id);
    currentUser.reactions.likes.push(targetDream._id);

    await Promise.all([targetDream.save(), currentUser.save()]);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.RESOURCE_LIKED,
      data: {
        userId: currentUser._id,
        dreamId: targetDream._id,
      },
    });
  } catch (error) {
    Logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
      error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
    });
  }
};

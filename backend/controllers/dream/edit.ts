import { Response } from "express";
import Logger from "../../util/logger";
import { AuthedRequest } from "../../middleware/auth/checkAuth";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import mongoose from "mongoose";
import { enviromentConfig } from "../../config";
import { Dream } from "../../models/dream.model";

interface EditDreamRequest extends AuthedRequest {
  body: {
    dreamId?: string;
    title?: string;
    description?: string;
    content?: string;
  };
}

export default async (req: EditDreamRequest, res: Response) => {
  const { title, description, content, dreamId } = req.body;
  const currentUser = req.user;

  // check if any data was sent
  if (!title && !description && !content) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.REQUIRED_FIELDS,
    });
    return;
  }

  // check if dream id is valid object id
  if (!(dreamId && mongoose.Types.ObjectId.isValid(dreamId))) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.DREAM.INVALID_DREAM_ID,
    });
    return;
  }

  if (!currentUser.dreams.some((id) => id.toString() == dreamId)) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.AUTH.DREAM.NOT_OWNER,
    });
    return;
  }

  // validate the sent data
  if (title) {
    if (!(title && Dream.validateTitle(title))) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.VALIDATION.DREAM.TITLE,
      });
      return;
    }
  }
  if (description) {
    if (!(description && Dream.validateDescription(description))) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.VALIDATION.DREAM.DESCRIPTION,
      });
      return;
    }
  }
  if (content) {
    if (!Dream.validateContent(content)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.VALIDATION.DREAM.CONTENT,
      });
      return;
    }
  }

  try {
    // Check if dream exist
    const targetDream = await Dream.findById(dreamId);

    if (!targetDream) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.VALIDATION.DREAM.INVALID_DREAM_ID,
      });
      return;
    }

    if (title) {
      targetDream.title = title;
    }
    if (description) {
      targetDream.description = description;
    }
    if (content) {
      targetDream.content = content;
    }

    await targetDream.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.CONTENT.DREAM.UPDATE,
      data: {
        dream: targetDream,
      },
    });
  } catch (error) {
    Logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR.SYSTEM.INTERNAL_ERROR,
      error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
    });
  }
};

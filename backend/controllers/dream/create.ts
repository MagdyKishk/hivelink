import { Request, Response } from "express";
import Logger from "../../util/logger";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import { Dream } from "../../models/dream.model";
import { enviromentConfig } from "../../config";
import { User, UserDocument } from "../../models";

interface CreateDreamRequest extends Request {
  body: {
    author?: string;
    title?: string;
    description?: string;
    content?: string;
  };
  user: UserDocument;
}

export default async (req: CreateDreamRequest, res: Response) => {
  const { author, title, description, content } = req.body;
  Logger.debug(
    `Request Creating New Dream { author: ${author}, title: ${title} }`
  );
  const currentUser = req.user;

  if (!author || !title || !description || !content) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.REQUIRED_FIELDS,
    });
    return;
  }

  if (!(Dream.validateAuthor(author) && author == currentUser._id.toString())) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.DREAM.INVALID_AUTHOR,
    });
    return;
  }
  if (!Dream.validateTitle(title)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.DREAM.TITLE,
    });
    return;
  }
  if (!Dream.validateDescription(description)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.DREAM.DESCRIPTION,
    });
    return;
  }
  if (!Dream.validateContent(content)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.DREAM.CONTENT,
    });
    return;
  }

  try {
    // Create new dream
    const newDream = await Dream.create({
      author: currentUser.id,
      title,
      description,
      content,
    });

    // Add new dream to dreams list
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { dreams: newDream._id }
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.CONTENT.DREAM.CREATE,
      data: {
        dream: newDream,
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

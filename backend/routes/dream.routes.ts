import express from "express";
import DreamController from "../controllers/dream";
import checkAuth from "../middleware/auth/checkAuth";

const DreamRouter = express.Router();


DreamRouter.post(
  "/create",
  //@ts-expect-error
  checkAuth,
  DreamController.create
);
DreamRouter.post(
  "/edit",
  //@ts-expect-error
  checkAuth,
  DreamController.edit
);

DreamRouter.post(
  "/like",
  //@ts-expect-error
  checkAuth,
  DreamController.reaction.like
);
DreamRouter.post(
  "/dislike",
  //@ts-expect-error
  checkAuth,
  DreamController.reaction.dislike
);

export default DreamRouter;

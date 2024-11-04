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

export default DreamRouter;

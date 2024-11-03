import express from "express"
import AuthController from "../controllers/auth";

const AuthRouter = express.Router();

AuthRouter.post('/signup', AuthController.signup)

export default AuthRouter
import express from "express"
import AuthController from "../controllers/auth";

const AuthRouter = express.Router();

AuthRouter.post('/signup', AuthController.signup)
AuthRouter.post('/login',  AuthController.login)
AuthRouter.post('/check',  AuthController.check)

export default AuthRouter
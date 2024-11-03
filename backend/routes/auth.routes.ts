import express from "express"
import AuthController from "../controllers/auth";

const AuthRouter = express.Router();

AuthRouter.post('/signup', AuthController.signup)
AuthRouter.post('/login',  AuthController.login)
AuthRouter.post('/logout',  AuthController.logout)
AuthRouter.post('/refresh', AuthController.refresh)
AuthRouter.get('/check', AuthController.check)

export default AuthRouter
import express from "express"
import AuthController from "../controllers/auth";
import checkAuth from "../middleware/auth/checkAuth";

const AuthRouter = express.Router();

AuthRouter.post('/signup', AuthController.signup)
AuthRouter.post('/login',  AuthController.login)
AuthRouter.post(
  "/logout",
  // @ts-ignore checkAuth
  checkAuth,
  AuthController.logout
);
AuthRouter.post('/refresh', AuthController.refresh)
AuthRouter.get('/check', AuthController.check)

AuthRouter.post(
  '/email/verify',
  // @ts-ignore checkAuth
  checkAuth,
  AuthController.email.verify
)

export default AuthRouter
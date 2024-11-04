import express from "express"
import AuthController from "../controllers/auth";
import checkAuth from "../middleware/auth/checkAuth";

const AuthRouter = express.Router();

AuthRouter.post('/signup', AuthController.signup)
AuthRouter.post('/login',  AuthController.login)
AuthRouter.post(
  "/logout",
  // @ts-ignore checkAuth is a middleware, not a function
  checkAuth,
  // @ts-ignore logout is a controller function
  AuthController.logout
);
AuthRouter.post('/refresh', AuthController.refresh)
AuthRouter.get('/check', AuthController.check)

export default AuthRouter
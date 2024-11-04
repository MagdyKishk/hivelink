import express from "express"
import AuthController from "../controllers/auth";
import checkAuth from "../middleware/auth/checkAuth";

const AuthRouter = express.Router();

/**
 * Basic Auth endpoints
 */
AuthRouter.post('/signup', AuthController.signup)
AuthRouter.post('/login',  AuthController.login)
AuthRouter.post(
  "/logout",
  // @ts-ignore checkAuth
  checkAuth,
  AuthController.logout
);

/**
 * Check and refresh token
 */
AuthRouter.post('/refresh', AuthController.refresh)
AuthRouter.get('/check', AuthController.check)

/**
 * Email Management
 */
AuthRouter.post(
  '/email/verify',
  // @ts-ignore checkAuth
  checkAuth,
  AuthController.email.verify
)
AuthRouter.post(
  '/email/remove',
  // @ts-ignore checkAuth
  checkAuth,
  AuthController.email.remove
)
AuthRouter.post(
  '/email/add',
  // @ts-ignore checkAuth
  checkAuth,
  AuthController.email.add
)

export default AuthRouter
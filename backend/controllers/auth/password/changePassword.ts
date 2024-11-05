import { Response, Request } from "express";
import { AuthedRequest } from "../../../middleware/auth/checkAuth";

interface ChangePassword extends AuthedRequest {
  body: {
    oldPassword?: string
  }
}
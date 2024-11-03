import { Email } from "./email.model";
import type { EmailDocument, EmailModel } from "./types/email.types";

import { User } from "./user.model";
import type { UserDocument, UserModel } from "./types/user.types";

import { Password } from "./password.model";
import type { PasswordDocument, PasswordModel } from "./types/password.types";

import { JwtToken } from "./token.model";
import type { JwtTokenDocument, JwtTokenModel } from "./types/token.model";

export type {
  // Email
  EmailDocument,
  EmailModel,

  // User
  UserDocument,
  UserModel,

  // Password
  PasswordDocument,
  PasswordModel,

  //JwtToken
  JwtTokenDocument,
  JwtTokenModel,
};
export { Email, User, Password, JwtToken };

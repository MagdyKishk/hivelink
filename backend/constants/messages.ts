import validator from "../validator";

export const MESSAGES = {
  VALIDATION: {
    REQUIRED_FIELDS: "All fields are required and must be filled out.",
    USER: {
      FIRSTNAME: validator.user.error.firstName,
      LASTNAME: validator.user.error.lastName,
      USERNAME: validator.user.error.userName,
    },
    EMAIL: {
      ADDRESS: validator.email.error.address,
      EXISTS: "This email is already registered.",
    },
    PASSWORD: validator.password.error.password,
    DREAM: {
      AUTHOR: "Invalid User Id",
      TITLE: validator.dream.error.title,
      DESCRIPTION: validator.dream.error.description,
      CONTENT: validator.dream.error.content,
    },
  },
  GENERAL: {
    INTERNAL_SERVER_ERROR:
      "An unexpected error occurred on our server. Please try again later.",
  },
  AUTH: {
    USER_DOES_NOT_EXIST:
      "The associated user account does not exist or has been deactivated.",
    USER_IS_AUTHENTICATED:
      "User is authenticated and ready to access the platform.",
    MISSING_AUTH_HEADER:
      "Authorization header is missing. Please provide a valid token.",
    INVALID_CREDS:
      "Invalid email or password",
    TOKEN: {
      INVALID_ACCESS_TOKEN:
        "The access token provided is invalid or has expired. Please log in again.",
      INVALID_REFRESH_TOKEN:
        "The refresh token provided is invalid or has expired. Please log in again.",
    },
  },
  SUCCESS: {
    DREAM_CREATED: "Dream created successfully",
    SIGNUP:
      "Welcome to our platform! Your account has been successfully created. We're excited to have you on board.",
    LOGIN: "Login successful! Welcome back!",
    LOGOUT: "You have successfully logged out.",
    REFRESHED_ACCESS_TOKEN: "New access token have been generated",
    PASSWORD_RESET:
      "Your password has been reset successfully. You can now log in with your new password.",
  },
} as const;

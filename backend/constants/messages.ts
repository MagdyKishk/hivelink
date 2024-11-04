import validator from "../validator";

export const MESSAGES = {
  SUCCESS: {
    AUTH: {
      SIGNUP: "Account created successfully! Welcome to our platform.",
      LOGIN: "Welcome back! You've successfully logged in.",
      LOGOUT: "You've been successfully logged out. Have a great day!",
      CHECK: "Authentication verified successfully.",
      TOKEN_REFRESH: "Authentication token has been refreshed successfully.",
      EMAIL_VERIFICATION: "Email address has been successfully verified.",
      PASSWORD_RESET: "Password has been reset successfully. Please log in with your new password.",
      EMAIL: {
        REMOVED: "Email address has been successfully removed from your account.",
      },
    },
    CONTENT: {
      DREAM: {
        CREATE: "Dream entry created successfully.",
        UPDATE: "Dream entry updated successfully.",
        DELETE: "Dream entry deleted successfully.",
      },
      REACTION: {
        LIKE: "Content has been liked successfully.",
        DISLIKE: "Content has been disliked successfully.",
        COMMENT: "Comment posted successfully.",
      },
    },
  },
  ERROR: {
    AUTH: {
      CREDENTIALS: {
        INVALID: "Invalid email or password. Please try again.",
        MISSING: "Please provide both email and password.",
      },
      TOKEN: {
        MISSING: "Authentication token is required. Please log in.",
        INVALID: "Invalid or expired authentication token. Please log in again.",
        REFRESH_FAILED: "Unable to refresh authentication token. Please log in again.",
      },
      USER: {
        NOT_FOUND: "User account not found or has been deactivated.",
        ALREADY_EXISTS: "An account with this email already exists.",
      },
      EMAIL: {
        VERIFICATION: {
          INVALID_CODE: "Invalid verification code provided.",
          EXPIRED_CODE: "Verification code has expired. Please request a new one.",
          ALREADY_VERIFIED: "This email has already been verified.",
          NOT_OWNED: "This email address is not associated with your account.",
          LAST_EMAIL: "Cannot remove your last email address. At least one email must remain.",
        },
      },
    },
    VALIDATION: {
      REQUIRED_FIELDS: "Please fill out all required fields.",
      USER: {
        FIRST_NAME: validator.user.error.firstName,
        LAST_NAME: validator.user.error.lastName,
        USERNAME: validator.user.error.userName,
      },
      EMAIL: {
        FORMAT: validator.email.error.address,
        INVALID_ID: "Invalid email identifier provided.",
      },
      PASSWORD: validator.password.error.password,
      DREAM: {
        INVALID_AUTHOR: "Invalid author identifier.",
        TITLE: validator.dream.error.title,
        DESCRIPTION: validator.dream.error.description,
        CONTENT: validator.dream.error.content,
      },
    },
    CONTENT: {
      NOT_FOUND: {
        DREAM: "Dream entry not found.",
        COMMENT: "Comment not found.",
      },
      REACTION: {
        ALREADY_LIKED: "You have already liked this content.",
        ALREADY_DISLIKED: "You have already disliked this content.",
      },
    },
    SYSTEM: {
      INTERNAL_ERROR: "An unexpected error occurred. Please try again later.",
    },
  },
} as const;

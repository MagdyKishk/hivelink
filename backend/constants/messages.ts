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
      TITLE: validator.dream.error.title,
      DESCRIPTION: validator.dream.error.description,
      CONTENT: validator.dream.error.content,
    },
  },
  GENERAL: {
    INTERNAL_SERVER_ERROR:
      "An unexpected error occurred on our server. Please try again later.",
  },
  SUCCESS: {
    SIGNUP:
      "Welcome to our platform! Your account has been successfully created. We're excited to have you on board.",
  },
} as const;

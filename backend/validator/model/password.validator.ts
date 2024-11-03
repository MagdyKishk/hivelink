const password = {
  regex: {
    password:
      /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[\p{S}\p{P}])[\p{L}\p{N}\p{S}\p{P}]{8,}$/u,
    minPassword: /^.{8,}$/,
  },
  error: {
    password:
      "Invalid Data: Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character. It also supports international characters.",
  },
} as const;

export default password;

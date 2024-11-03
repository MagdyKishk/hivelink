const user = {
  regex: {
    firstName: /^[A-Za-z'\-]{2,50}$/,
    lastName: /^[A-Za-z'\-]{2,50}$/,
    userName: /^User-[0-9a-f]{8}$/,
  },
  error: {
    firstName:
      "Invalid Data: First name must be between 2 and 50 characters and can contain only letters, hyphens, and apostrophes.",
    lastName:
      "Invalid Data: Last name must be between 2 and 50 characters and can contain only letters, hyphens, and apostrophes.",
    userName:
      "Invalid Data: Username must follow the format 'User-xxxxxxxx' where 'xxxxxxxx' is an 8-character hexadecimal string (0-9, a-f).",
  },
} as const;

export default user;

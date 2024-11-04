const email = {
  regex: {
    address: /^[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,}$/u,
    maximumEmails: 5,
  },
  error: {
    address:
      "Invalid Data: Email must follow the standard format (e.g., user@example.com), allowing international characters. No spaces are allowed.",
  },
} as const;

export default email;

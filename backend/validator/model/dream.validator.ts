const dream = {
  regex: {
    title: /^.{10,100}$/u,
    description: /^.{20,500}$/u,
    content: /^.{50,50000}$/u,
  },
  error: {
    title: "Invalid Data: Title must be between 10 and 100 characters.",
    description:
      "Invalid Data: Description must be between 20 and 500 characters.",
    content: "Invalid Data: Content must be between 50 and 50,000 characters.",
  },
} as const;

export default dream;

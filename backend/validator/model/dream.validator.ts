const dream = {
  regex: {
    title: /^[\p{L}\p{N}\s]{3,100}$/u,
    description: /^[\p{L}\p{N}\p{P}\s]{10,500}$/u,
    content: /^[\p{L}\p{N}\p{P}\s]{20,50000}$/u,
  },
  error: {
    title:
      "Invalid Data: Title must be at least 3 characters and 100 maximum. It can only contain letters, numbers, and spaces.",
    description:
      "Invalid Data: Description must be at least 10 characters and 500 maximum. It can include letters, numbers, punctuation, and spaces.",
    content:
      "Invalid Data: Content must be at least 20 characters and 50000 maximum. It can include letters, numbers, punctuation, and spaces.",
  },
};

export default dream;

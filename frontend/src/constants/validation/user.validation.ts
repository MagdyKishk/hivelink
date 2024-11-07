const user = {
    regex: {
        firstName: /^[A-Za-z'-]{2,50}$/,
        lastName: /^[A-Za-z'-]{2,50}$/,
        userName: /^User-[0-9a-f]{8}$/,
    },
    error: {
        firstName:"First name must be between 2 and 50 characters.",
        lastName:"Last name must be between 2 and 50 characters.",
        userName:"Invalid Username must follow the format.",
    },
} as const;

export default user;

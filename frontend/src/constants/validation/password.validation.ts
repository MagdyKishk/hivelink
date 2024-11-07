const password = {
    regex: {
        password: /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[\p{S}\p{P}])[\p{L}\p{N}\p{S}\p{P}]{8,}$/u,
    },
    error: {
        password: "Invalid Password Format.",
    },
} as const;

export default password;

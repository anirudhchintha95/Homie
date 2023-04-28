export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: "Email is required." };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { isValid: false, error: "Invalid email format." };
    }
    return { isValid: true, error: "" };
};

export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, error: "Password is required." };
    } else if (
        !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(
            password
        )
    ) {
        return {
            isValid: false,
            error: "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.",
        };
    }
    return { isValid: true, error: "" };
};

function isValidEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) return false;
    return true;
}

function isValidPassword(password) {
    if (!password || password.length < 5) return false;
    return true;
}

export { isValidEmail, isValidPassword };

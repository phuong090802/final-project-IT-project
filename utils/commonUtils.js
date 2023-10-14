export const isNullOrWhitespace = (input) =>
    !input || !input.trim().length;

export const phoneValidate = (phone) =>
    /^(0[0-9]{9,10}|84[0-9]{8,9})$/.test(phone);

export const emailValidate = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

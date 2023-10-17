import { validatorCreateUser, validatorCreateUserDetails, validatorUpdateUserDetails } from '../utils/userUtils.js'

export const verifyCreateUser = async (req, res, next) => {
    const { username, password } = req.body;
    const messageValidate = await validatorCreateUser(username, password);
    if (messageValidate) {
        return res.status(messageValidate.status).json({ success: false, message: messageValidate.message });
    }
    next();
}

export const verifyCreateUserDetails = async (req, res, next) => {
    const { name, phone, email } = req.body;
    const messageValidate = await validatorCreateUserDetails(name, phone, email);
    if (messageValidate) {
        return res.status(messageValidate.status).json({ success: false, message: messageValidate.message });
    }
    next();
}

export const verifyUpdateUserDetails = async (req, res, next) => {
    const user = req.user;
    if (user) {
        const { name, phone, email } = req.body;
        const messageValidate = await validatorUpdateUserDetails(name, phone, email);
        if (messageValidate) {
            return res.status(messageValidate.status).json({ success: false, message: messageValidate.message });
        }
        next();
    }
    res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
}



import { validatorCreateUser } from '../utils/userUtils.js'


export const verifyCreateUser = async (req, res, next) => {
    const { name, phone, email, password } = req.body;
    const messageValidate = await validatorCreateUser(name, phone, email, password);
    if (messageValidate) {
        return res.status(messageValidate.status).json({ error: messageValidate.message });
    }
    next();
}

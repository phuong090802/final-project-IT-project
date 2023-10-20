import { validationCreate } from '../utils/accountUtils.js'

export const handleValidationCreate = async (req, res, next) => {
    const { username, password } = req.body;
    const error = await validationCreate(username, password);
    if (error) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
    next();
}

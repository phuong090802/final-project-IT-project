import { validationCreate, validationUpdate } from '../utils/userUtils.js'

export const handleValidationCreate = async (req, res, next) => {
    const { name, phone, email } = req.body;
    const error = await validationCreate(req.user._id, name, phone, email);
    if (error) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
    next();
}

export const handleValidationUpdate = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
    }

    const { name, phone, email } = req.body;
    const error = await validationUpdate(name, phone, email);
    if (error) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
    next();
}



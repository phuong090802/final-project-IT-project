import { validationCreate, validationUpdate } from '../utils/topicUtils.js'
import { idValidate } from '../utils/commonUtils.js';


export const handleValidationCreate = async (req, res, next) => {
    const { name, quantity, begin, end } = req.body;
    const error = await validationCreate(req.user._id, name, quantity, begin, end);
    if (error) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
    next();
}

export const handleValidateUpdate = async (req, res, next) => {
    const { id } = req.params;
    if (!idValidate(id)) {
        return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
    }
    const { name, quantity, begin, end } = req.body;
    const error = await validationUpdate(id, name, quantity, begin, end);
    if (error) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
    next();
}

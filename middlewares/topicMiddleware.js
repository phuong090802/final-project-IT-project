import { validatorCreateTopic, validatorUpdateTopic } from '../utils/topicUtils.js'


export const verifyCreateTopic = async (req, res, next) => {
    const { name, begin, end } = req.body;
    const messageValidate = await validatorCreateTopic(name, begin, end);
    if (messageValidate) {
        return res.status(messageValidate.status).json({ success: false, message: messageValidate.message });
    }
    next();
}

export const verifyUpdateTopic = async (req, res, next) => {
    const { id } = req.params;
    const { name, begin, end } = req.body;
    const messageValidate = await validatorUpdateTopic(id, name, begin, end);
    if (messageValidate) {
        return res.status(messageValidate.status).json({ success: false, message: messageValidate.message });
    }
    next();
}

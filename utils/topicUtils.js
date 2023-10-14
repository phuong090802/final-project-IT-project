import Topic from '../models/Topic.js';
import { isNullOrWhitespace } from './commonUtils.js';

export const validatorCreateTopic = async (name, begin, end) => {
    const validateError = isNullOrWhitespaceorFormat(name);
    if (validateError) {
        return { status: validateError.status, message: validateError.message };
    }
    const validateBeginError = beginInvalid(begin);
    if (validateBeginError) {
        return { status: validateBeginError.status, message: validateBeginError.message };
    }
    const endInvalidError = endInvalid(begin, end);
    if (endInvalidError) {
        return { status: endInvalidError.status, message: endInvalidError.message };
    }
    const duplicateName = await Topic.findOne({ name: { $regex: name, $options: 'i' } });
    if (duplicateName) {
        return { status: 409, message: 'Tên đã tồn tại.' }
    }
    return null;
}

const isNullOrWhitespaceorFormat = (name) => {
    if (isNullOrWhitespace(name)) {
        return { status: 400, message: 'Tên không hợp lệ.' }
    }
    return null;
}

const beginInvalid = (begin) => {
    const currentDate = new Date();
    const beginDate = new Date(begin);
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const beginDay = beginDate.getDate();
    const beginMonth = beginDate.getMonth() + 1;
    const beginYear = beginDate.getFullYear();
    if (currentDay > beginDay && currentMonth > beginMonth && currentYear > beginYear) {
        return { status: 400, message: 'Ngày bắt đầu không hợp lệ.' }
    }
    return null;
}


const endInvalid = (begin, end) => {
    const beginDate = new Date(begin);
    const endDate = new Date(end);
    if (beginDate >= endDate) {
        return { status: 400, message: 'Ngày kết thúc không hợp lệ.' }
    }
    return null;
}

export const validatorUpdateTopic = async (id, name, begin, end) => {
    const validateError = isNullOrWhitespaceorFormat(name);
    if (validateError) {
        return { status: validateError.status, message: validateError.message };
    }
    const validateBeginError = beginInvalid(begin);
    if (validateBeginError) {
        return { status: validateBeginError.status, message: validateBeginError.message };
    }
    const endInvalidError = endInvalid(begin, end);
    if (endInvalidError) {
        return { status: endInvalidError.status, message: endInvalidError.message };
    }
    const duplicateName = await Topic.findOne({
        $and: [
            { _id: { $ne: id } },
            { name: { $regex: name, $options: 'i' } }
          
        ]
    });
    if (duplicateName) {
        return { status: 409, message: 'Tên đã tồn tại.' }
    }
    return null;
}
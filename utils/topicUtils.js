import Topic from '../models/Topic.js';
import { isNullOrWhitespace } from './commonUtils.js';
import User from '../models/User.js';

export const validationCreate = async (id, name, quantity, begin, end) => {
    const user = await User.findOne({ account: id });
    if (!user) {
        return { status: 404, message: 'Vui lòng cập nhật thông tin cá nhân trước khi tạo đề tài.' };
    }

    const error = isNullOrWhitespaceOrFormat(name);
    if (error) {
        return { status: error.status, message: error.message };
    }
    const quantityValue = Number(quantity);
    if (quantityValue < 0) {
        return { status: 400, message: 'Số lượng không hợp lệ.' };
    }

    const beginError = beginInvalid(begin);
    if (beginError) {
        return { status: beginError.status, message: beginError.message };
    }

    const endError = endInvalid(begin, end);
    if (endError) {
        return { status: endError.status, message: endError.message };
    }

    const nameExists = await Topic.findOne({ name: { $regex: name, $options: 'i' } });
    if (nameExists) {
        return { status: 409, message: 'Tên đã tồn tại.' };
    }
    return null;
}

const isNullOrWhitespaceOrFormat = (name) => {
    if (isNullOrWhitespace(name)) {
        return { status: 400, message: 'Tên không hợp lệ.' };
    }
    return null;
}

const beginInvalid = (begin) => {
    const current = new Date();
    const beginDate = new Date(begin);

    if (current > beginDate) {
        return { status: 400, message: 'Ngày bắt đầu không hợp lệ.' }
    }
    return null;
}


const endInvalid = (begin, end) => {
    const beginDate = new Date(begin);
    const endDate = new Date(end);
    if (beginDate >= endDate) {
        return { status: 400, message: 'Ngày kết thúc không hợp lệ.' };
    }
    return null;
}

export const validationUpdate = async (id, name, quantity, begin, end) => {
    const error = isNullOrWhitespaceOrFormat(name);
    if (error) {
        return { status: error.status, message: error.message };
    }
    const quantityValue = Number(quantity);
    if (quantityValue < 0) {
        return { status: 400, message: 'Số lượng không hợp lệ.' };
    }

    const errorBegin = beginInvalid(begin);
    if (errorBegin) {
        return { status: errorBegin.status, message: errorBegin.message };
    }

    const errorEnd = endInvalid(begin, end);
    if (errorEnd) {
        return { status: errorEnd.status, message: errorEnd.message };
    }

    const nameExists = await Topic.findOne({
        _id: { $ne: id },
        name: {
            $regex: name,
            $options: 'i'
        }

    });

    if (nameExists) {
        return { status: 409, message: 'Tên đã tồn tại.' };
    }
    return null;
}
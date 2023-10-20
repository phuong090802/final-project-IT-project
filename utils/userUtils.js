import User from '../models/User.js';
import { isNullOrWhitespace } from './commonUtils.js';


export const validationCreate = async (id, name, phone, email) => {
    const user = await User.findOne({ account: id });
    if (user) {
        return { status: 409, message: 'Thông tin đã tồn tại.' };
    }

    const error = isNullOrWhitespaceInput(name, phone, email);
    if (error) {
        return { status: error.status, message: error.message };
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
        return { status: 409, message: 'Số điện thoại đã tồn tại.' };
    }

    const mailExists = await User.findOne({ email });
    if (mailExists) {
        return { status: 409, message: 'Email đã tồn tại.' };
    }
    return null;
}

const isNullOrWhitespaceInput = (name, phone, email) => {
    if (isNullOrWhitespace(name)) {
        return { status: 400, message: 'Tên đăng nhập không hợp lệ.' };
    }

    if (isNullOrWhitespace(phone)) {
        return { status: 400, message: 'Mật khẩu không hợp lệ.' };
    }

    if (isNullOrWhitespace(email)) {
        return { status: 400, message: 'Email không hợp lệ.' };
    }
    return null;
}

export const validationUpdate = async (id, name, phone, email) => {
    const error = isNullOrWhitespace(name, phone, email);
    if (error) {
        return { status: error.status, message: error.message };
    }

    const phoneExists = await User.findOne({ id: { $ne: id }, phone });
    if (phoneExists) {
        return { status: 409, message: 'Số điện thoại đã tồn tại.' };
    }

    const emailExists = await User.findOne({ id: { $ne: id }, email });
    if (emailExists) {
        return { status: 409, message: 'Email đã tồn tại.' };
    }
    return null;
}

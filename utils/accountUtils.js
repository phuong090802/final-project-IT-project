import Account from '../models/Account.js';
import { isNullOrWhitespace } from './commonUtils.js';

export const validationCreate = async (username, password) => {

    const error = isNullOrWhitespaceCreate(username, password);
    if (error) {
        return { status: error.status, message: error.message };
    }

    const usernameExists = await Account.findOne({ username: username });
    if (usernameExists) {
        return { status: 409, message: 'Tài khoản đã tồn tại.' };
    }
    return null;
}

const isNullOrWhitespaceCreate = (username, password) => {
    if (isNullOrWhitespace(username)) {
        return { status: 400, message: 'Tên đăng nhập không hợp lệ.' };
    }

    if (isNullOrWhitespace(password)) {
        return { status: 400, message: 'Mật khẩu không hợp lệ.' };
    }
    return null;
}
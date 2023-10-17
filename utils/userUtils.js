import User from '../models/User.js';
import UserDetails from '../models/UserDetails.js';
import { isNullOrWhitespace } from './commonUtils.js';

export const validatorCreateUser = async (username, password) => {

    const validateError = isNullOrWhitespaceCreateUser(username, password);
    if (validateError) {
        return { status: validateError.status, message: validateError.message };
    }
    const duplicateUsername = await User.findOne({ username: username });
    if (duplicateUsername) {
        return { status: 409, message: 'Tài khoản đã tồn tại.' };
    }
    return null;
}

const isNullOrWhitespaceCreateUser = (username, password) => {
    if (isNullOrWhitespace(username)) {
        return { status: 400, message: 'Tên đăng nhập không hợp lệ.' };
    }
    else if (isNullOrWhitespace(password)) {
        return { status: 400, message: 'Mật khẩu không hợp lệ.' };
    }
    return null;
}

export const validatorCreateUserDetails = async (name, phone, email) => {

    const validateError = isNullOrWhitespaceCreateUserDetails(name, phone, email);
    if (validateError) {
        return { status: validateError.status, message: validateError.message };
    }
    const duplicatePhone = await UserDetails.findOne({ phone: phone });
    if (duplicatePhone) {
        return { status: 409, message: 'Số điện thoại đã tồn tại.' };
    }
    const duplicateEmail = await UserDetails.findOne({ email: email });
    if (duplicateEmail) {
        return { status: 409, message: 'Email đã tồn tại.' };
    }
    return null;
}

const isNullOrWhitespaceCreateUserDetails = (name, phone, email) => {
    if (isNullOrWhitespace(name)) {
        return { status: 400, message: 'Tên đăng nhập không hợp lệ.' };
    }
    else if (isNullOrWhitespace(phone)) {
        return { status: 400, message: 'Mật khẩu không hợp lệ.' };
    }
    else if (isNullOrWhitespace(email)) {
        return { status: 400, message: 'Email không hợp lệ.' };
    }
    return null;
}

export const validatorUpdateUserDetails = async (id, name, phone, email) => {

    const validateError = isNullOrWhitespaceCreateUserDetails(name, phone, email);
    if (validateError) {
        return { status: validateError.status, message: validateError.message };
    }
    const duplicatePhone = await UserDetails.findOne({ id: { $ne: id }, phone: phone });
    if (duplicatePhone) {
        return { status: 409, message: 'Số điện thoại đã tồn tại.' };
    }
    const duplicateEmail = await UserDetails.findOne({ id: { $ne: id }, email: email });
    if (duplicateEmail) {
        return { status: 409, message: 'Email đã tồn tại.' };
    }
    return null;
}

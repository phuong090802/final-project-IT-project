import User from '../models/User.js';
import { emailValidate, isNullOrWhitespace, phoneValidate } from './commonUtils.js';
export const validatorCreateUser = async (name, phone, email, password) => {
  
   
    const validateError = isNullOrWhitespaceorFormat(name, phone, email, password);
    if (validateError) {
        return { status: validateError.status, message: validateError.message };
    }
    const duplicatePhone = await User.findOne({ phone: phone });
    if (duplicatePhone) {
        return { status: 409, message: 'Số điện thoại đã tồn tại.' }
    }
    const duplicateEmail = await User.findOne({ email: email });
    if (duplicateEmail) {
        return { status: 409, message: 'Email đã tồn tại.' }
    }
    return null;
}

const isNullOrWhitespaceorFormat = (name, phone, email, password) => {
    if (isNullOrWhitespace(name)) {
        return { status: 400, message: 'Tên không hợp lệ.' }
    } else if (isNullOrWhitespace(phone)) {
        return { status: 400, message: 'Số điện thoại không hợp lệ.' }
    } else if (isNullOrWhitespace(email)) {
        return { status: 400, message: 'Email không hợp lệ.' }
    } else if (isNullOrWhitespace(password)) {
        return { status: 400, message: 'Mật khẩu không hợp lệ.' }
    } else if (!phoneValidate(phone)) {
        return { status: 400, message: 'Định dạng số điện thoại hợp lệ.' }
    } else if (!emailValidate(email)) {
        return { status: 400, message: 'Định dạng email không hợp lệ.' }
    }
    return null;
}
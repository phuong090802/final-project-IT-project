import mongoose from 'mongoose';
import validator from 'validator';

const userDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên'],
        maxLength: [25, 'Tên không được vượt quá 25 ký tự']
    },
    phone: {
        type: String,
        required: [true, 'Vui lòng nhập số điện thoại'],
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, 'vi-VN') || validator.isMobilePhone(value, 'vi-VN', { strictMode: false });
            },
            message: 'Vui lòng nhập số điện thoại hợp lệ ở Việt Nam'
        }
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        maxLength: [255, 'Email không được vượt quá 255 ký tự'],
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Vui lòng nhập email hợp lệ'
        }
    },
    image: {
        ref: {
            type: String
        },
        url: {
            type: String
        }
    },
    degree: {
        type: String,
        required: [true, 'Vui lòng nhập học vị'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Thiếu thông tin người dùng'],
        ref: 'User'
    }

}, { timestamps: true }
);

const UserDetails = mongoose.model('userDetails', userDetailsSchema);
export default UserDetails;

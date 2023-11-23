import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên'],
        maxLength: [25, 'Tên không được vượt quá 25 ký tự']
    },
    username: {
        type: String,
        required: [true, 'Vui lòng nhập tên đăng nhập'],
        maxLength: [255, 'Tên đăng nhập không được vượt quá 255 ký tự'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minLength: [6, 'Mật khẩu phải dài hơn 6 ký tự'],
        select: false
    },
    role: {
        type: String,
        enum: {
            values: [
                'user',
                'admin',
            ],
            message: 'Quyền truy cập không hợp lệ',
        },
        default: 'user'
    }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_TIME
    });
}

const User = mongoose.model('User', userSchema);


export default User;
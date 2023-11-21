import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token không thể bỏ trống'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    expires: {
        type: Date,
        required: [true, 'Thời gian sống token không thể bỏ trống'],
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RefreshToken'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Thiếu thông tin người dùng'],
        ref: 'User'
    }
}, { collection: 'refresh-tokens', timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
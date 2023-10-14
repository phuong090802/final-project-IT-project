import mongoose from 'mongoose';
import { USER, ADMIN } from '../constants/roleConstant.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [USER, ADMIN],
        default: 'User',
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;

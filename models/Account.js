import mongoose from 'mongoose';
import { ROLE_USER, ROLE_ADMIN, ACCOUNT } from '../constants/dbConstant.js';

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [ROLE_USER, ROLE_ADMIN],
        required: true,
        default: ROLE_USER
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true }
);

const Account = mongoose.model(ACCOUNT, accountSchema);
export default Account;

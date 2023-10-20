import mongoose from 'mongoose';
import { ACCOUNT, REFRESH_TOKEN, REFRESH_TOKEN_COLLECTION } from '../constants/dbConstant.js';

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    expires: {
        type: Date,
        required: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: REFRESH_TOKEN
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ACCOUNT
    }
}, { collection: REFRESH_TOKEN_COLLECTION, timestamps: true });

const RefreshToken = mongoose.model(REFRESH_TOKEN, refreshTokenSchema);
export default RefreshToken;

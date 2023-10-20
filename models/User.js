import mongoose from 'mongoose';
import { USER, ACCOUNT } from '../constants/dbConstant.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    image: {
        ref: {
            type: String
        },
        url: {
            type: String
        }
    },
    description: {
        type: String
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ACCOUNT
    }

}, { timestamps: true }
);

const User = mongoose.model(USER, userSchema);
export default User;

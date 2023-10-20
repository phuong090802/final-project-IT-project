import mongoose from 'mongoose';
import { TOPIC, USER } from '../constants/dbConstant.js';

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    begin: {
        type: Date,
        required: true,
        default: Date.now
    },
    end: {
        type: Date,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: USER
    }
}, { timestamps: true });

const Topic = mongoose.model(TOPIC, topicSchema);
export default Topic;

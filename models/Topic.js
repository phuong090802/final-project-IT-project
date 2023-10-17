import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    numberOfStudent: {
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
        ref: 'User'
    }
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;

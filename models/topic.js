import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên đề tài'],
        unique: true
    },
    description: {
        type: String
    },
    beginAt: {
        type: Date,
        required: [true, 'Ngày bắt đầu không thể bỏ trống'],
    },
    endAt: {
        type: Date,
        required: [true, 'Ngày kết thúc không thể bỏ trống'],
        validate: {
            validator: function (value) {
                return this.beginAt < value;
            },
            message: 'Ngày kết thúc phải sau ngày bắt đầu'
        }
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Thiếu thông tin người hướng dẫn'],
        ref: 'User'
    }
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;

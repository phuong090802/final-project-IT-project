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
    quantity: {
        type: Number,
        required: [true, 'Số lượng sinh viên hướng dẫn không thể bỏ trống'],
    },
    beginAt: {
        type: Date,
        required: [true, 'Ngày bắt đầu không thể bỏ trống'],
    },
    endAt: {
        type: Date,
        required: [true, 'Ngày kết thúc không thể bỏ trống'],
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Thiếu thông tin người hướng dẫn'],
        ref: 'UserDetails'
    }
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;

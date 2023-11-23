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
        validate: {
            validator: function (value) {
                return this.endAt > value;
            },
            message: 'Ngày kết thúc phải trước ngày kết thúc'
        }
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
        ref: 'UserDetails'
    }
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;

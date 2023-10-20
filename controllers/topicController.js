import Topic from '../models/Topic.js';
import User from '../models/User.js';
import { idValidate } from '../utils/commonUtils.js';

export const handleCreate = async (req, res) => {
    const { name, description, quantity, begin, end } = req.body;
    try {
        const account = req.user;
        const user = await User.findOne({ account: account._id });
        await Topic.create({ name, description, quantity, begin, end, instructor: user.id });
        res.status(201).json({ success: true, message: 'Tạo tài đề tài thành công.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleUpdate = async (req, res) => {
    const { id } = req.params;
    try {
        const topic = await Topic.findById(id);
        if (!topic) {
            return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
        }

        const account = req.user;

        const user = await User.findOne({ account: account._id });
        if (!topic.instructor.equals(user._id)) {
            return res.status(403).json({ success: false, message: 'Thao tác không hợp lệ.' });
        }
        const { name, description, quantity, begin, end } = req.body;
        await Topic.findByIdAndUpdate(id, { name, description, quantity, begin, end });
        res.status(200).json({ success: true, message: 'Cập nhật đề tài thành công.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


export const handleDelete = async (req, res) => {
    const { id } = req.params;
    if (!idValidate(id)) {
        return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
    }

    try {
        const account = req.user;
        const user = await User.findOne({ account: account._id });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Vui lòng cập nhật thông tin cá nhân trước khi tạo đề tài.' });
        }
        const topic = await Topic.findById(id);
        deleteTopicAndResponse(user._id, topic, res);

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const deleteTopicAndResponse = (userId, topic, res) => {
    if (!topic) {
        return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
    }

    if (!topic.instructor.equals(userId)) {
        return res.set(403).json({ success: false, message: 'Thao tác không hợp lệ.' });
    }
    res.status(200).json({ success: true, message: 'Xóa đề tài thành công.' });
}

export const handleGet = async (req, res) => {
    const { id } = req.params;
    if (!idValidate(id)) {
        return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
    }
    try {
        const topic = await Topic.findById(id);
        if (!topic) {
            return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
        }
        res.status(200).json({ success: true, data: topic });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleGetAll = async (req, res) => {
    const size = Number(req.query.size) || 5;
    const page = Number(req.query.page) || 1;
    const { sortBy, sortOrder } = req.query;
    const sortCriteria = {};
    if (sortBy) {
        sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    const query = req.query.value
        ? {
            $or: [
                {
                    name: {
                        $regex: req.query.value,
                        $options: 'i',
                    }
                },
                {
                    description: {
                        $regex: req.query.value,
                        $options: 'i'
                    }
                }
            ]
        }
        : {};
    try {
        const count = await Topic.countDocuments({ ...query });
        const topics = await Topic.find({ ...query })
            .sort(sortCriteria)
            .limit(size)
            .skip(size * (page - 1));
        res.json({ success: true, data: { topics, page, pages: Math.ceil(count / size) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
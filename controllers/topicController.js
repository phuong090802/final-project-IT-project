import Topic from '../models/Topic.js';
import mongoose from 'mongoose';

export const handleCreate = async (req, res) => {
    const { name, description, numberOfStudent, begin, end } = req.body;
    try {
        const user = req.user;
        if (user) {
            await Topic.create({ name: name, description: description, numberOfStudent: numberOfStudent, begin: begin, end: end, instructor: user._id });
            return res.status(201).json({ success: true, message: 'Tạo tài đề tài thành công.' });
        }
        res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleUpdate = async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
    }
    try {
        const user = req.user;
        if (user) {
            const topic = await Topic.findById(id);
            return updateTopicAndRespose(req, user, topic);
        }
        res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const updateTopicAndRespose = async (req, user, topic) => {
    if (topic) {
        if (topic.instructor === user._id) {
            const { name, description, numberOfStudent, begin, end } = req.body;
            await Topic.findByIdAndUpdate(id, { name, description, numberOfStudent, begin, end });
            return res.status(204).json({ success: true, message: 'Cập nhật đề tài thành công.' });
        }
        return res.set(403).json({ success: false, message: 'Thao tác không hợp lệ.' });
    }
    return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
}

export const handleDelete = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
    }
    try {
        const user = req.user;
        if (user) {
            const topic = await Topic.findById(id);
            return deleteTopicAndResponse(user, topic);
        }
        res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const deleteTopicAndResponse = (user, topic) => {
    if (topic) {
        if (topic.instructor === user._id) {
            return res.status(204).json({ success: true, message: 'Xóa đề tài thành công.' });
        }
        return res.set(403).json({ success: false, message: 'Thao tác không hợp lệ.' });
    }
    return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
}

export const handleGet = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
    }
    try {
        const user = req.user;
        if (user) {
            const topic = await Topic.findById(id);
            if (topic) {
                return res.status(200).json({ success: true, data: topic });
            }
            return res.status(404).json({ success: false, message: 'Đề tài không tồn tại.' });
        }
        res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleGetAll = async (req, res) => {
    const size = Number(req.query.size) || 5;
    const page = Number(req.query.size) || 0;
    const { sortBy, sortOrder } = req.query;
    let sortCriteria = {};
    if (sortBy) {
        sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    const query = req.query.value
        ? {
            $or: [
                { name: { $regex: req.query.value, $options: 'i' } },
                { description: { $regex: req.query.value, $options: 'i' } },
            ],
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
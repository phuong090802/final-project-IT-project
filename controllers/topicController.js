import Topic from '../models/Topic.js';
import mongoose from 'mongoose';

export const handleCreate = async (req, res) => {
    const { name, description, begin, end } = req.body;
    try {
        const user = req.user;
        if (user) {
            await Topic.create({ name: name, description: description, begin: begin, end: end, instructor: user._id });
            return res.status(201).json({ success: 'Tạo tài đề tài thành công.' });
        }
        res.status(401).json({ error: 'Không đủ quyền truy cập.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const handleUpdate = async (req, res) => {
    const { name, description, begin, end } = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Đề tài không tồn tại.' });
    }
    try {
        const user = req.user;
        if (user) {
            const topic = await Topic.findByIdAndUpdate(id, { name, description, begin, end });
            if (topic) {
                return res.status(204).send();
            }
            return res.status(404).json({ error: 'Đề tài không tồn tại.' });
        }
        res.status(401).json({ error: 'Không đủ quyền truy cập.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const handleDelete = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Đề tài không tồn tại.' });
    }
    try {
        const user = req.user;
        if (user) {
            const topic = await Topic.findByIdAndRemove(id);
            if (topic) {
                return res.status(204).send();
            }
            return res.status(404).json({ error: 'Đề tài không tồn tại.' });
        }
        res.status(401).json({ error: 'Không đủ quyền truy cập.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
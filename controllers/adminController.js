import User from '../models/User.js';
import Topic from '../models/Topic.js';
import bcrypt from 'bcrypt';


export const handleCreateUser = async (req, res) => {

    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username: username, password: hashedPassword });
        res.status(201).json({ success: true, message: 'Tạo tài khoản thành công.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleDisableUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }
    try {
        const user = await User.findById(id);
        if (user) {
            User.findByIdAndUpdate(id, { status: false });
            return res.json({ success: true, message: `Khóa tài khoản ${user.username} thành công.` });
        }
        res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });

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
                { username: { $regex: req.query.value, $options: 'i' } },
                { status: { $regex: req.query.value, $options: 'i' } },
            ],
        }
        : {};
    try {
        const count = await User.countDocuments({ ...query });
        const users = await User.find({ ...query })
            .sort(sortCriteria)
            .limit(size)
            .skip(size * (page - 1));
        res.json({ success: true, data: { users, page, pages: Math.ceil(count / size) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleCountUsers = async (req, res) => {
    const count = await User.countDocuments({ ...query });
    res.json({ success: true, count: count });
}

export const handleCountTopics = async (req, res) => {
    const count = await Topic.countDocuments({ ...query });
    res.json({ success: true, count: count });
}

export const handleChangePassword = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không thể trống.' });
        }
        const user = await User.findById(id);
        if (user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.findByIdAndUpdate(user._id, { password: hashedPassword });
            res.json({ success: true, message: 'Đặt lại mật khẩu thành công.' })
        }
        res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
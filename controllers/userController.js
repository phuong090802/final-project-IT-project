import UserDetails from '../models/UserDetails.js';
import User from '../models/User.js';
import { isNullOrWhitespace } from '../utils/commonUtils.js';

export const handleCreateUserDetails = async (req, res) => {
    const user = req.user
    if (user) {
        try {
            const { name, phone, email, image, description } = req.body;
            await UserDetails.create({ name: name, phone: phone, email: email, image: image, description: description, user: user._id });
            return res.status(500).json({ success: true, message: 'Tạo thông tin thành công.' });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
    res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
}

export const handleGet = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Thông tin người dùng không tồn tại.' });
    }
    try {
        const userDetails = await UserDetails.findById(id);
        if (userDetails) {
            return res.status.json({ success: true, data: userDetails });
        }
        return res.status(404).json({ success: false, message: 'Thông tin người dùng không tồn tại.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleUpdateUserDetails = async (req, res) => {
    const user = req.user
    if (user) {
        try {
            const { name, phone, email, image, description } = req.body;
            await UserDetails.updateOne({ user: user._id },
                { $set: { name: name, phone: phone, email: email, image: image, description: description, user: user._id } });
            return res.status(500).json({ success: true, message: 'Cập nhật thông tin thành công.' });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
    res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
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
                { phone: { $regex: req.query.value, $options: 'i' } },
                { email: { $regex: req.query.value, $options: 'i' } },
                { description: { $regex: req.query.value, $options: 'i' } },
            ],
        }
        : {};
    try {
        const count = await UserDetails.countDocuments({ ...query });
        const users = await UserDetails.find({ ...query })
            .sort(sortCriteria)
            .limit(size)
            .skip(size * (page - 1));
        res.json({ success: true, data: { users, page, pages: Math.ceil(count / size) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleUserDetailsExists = async (req, res) => {
    const user = req.user;
    if (user) {
        const userDetails = UserDetails.findOne({ user: user._id });
        if (userDetails) {
            return res.json({ success: true, exists: true });
        }
        res.json({ success: true, exists: false });
    }
    res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
}

export const handleChangePassword = async (req, res) => {
    const user = req.user;
    const { password, newPassword, confirmPassword } = req.body;
    if (user) {
        const currentUser = await User.findById(user._id);
        const isMatch = bcrypt.compare(password, currentUser.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác.' });
        }
        if (isNullOrWhitespace(newPassword)) {
            return { status: 400, success: false, message: 'Mật khẩu mới không hợp lệ.' };
        }
        if (newPassword !== confirmPassword) {
            return { status: 400, success: false, message: 'Xác nhận mật khẩu không lớp.' };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        res.status(204).json({ success: true, message: 'Đổi mât khẩu thành công.' });
    }
    res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
}
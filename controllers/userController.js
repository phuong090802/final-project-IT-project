import User from '../models/User.js';
import Account from '../models/Account.js';
import { isNullOrWhitespace } from '../utils/commonUtils.js';
import { idValidate } from '../utils/commonUtils.js';
import { COOKIE_NAME, AUTH_ENDPOINT } from '../constants/cookiesConstant.js';
import bcrypt from 'bcrypt';
import RefreshToken from '../models/RefreshToken.js';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebaseConfig.js';

export const handleCreate = async (req, res) => {
    const account = req.user;
    try {
        const { name, phone, email, image, description } = req.body;
        await User.create({ name, phone, email, image, description, account: account._id });
        res.status(201).json({ success: true, message: 'Tạo thông tin thành công.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const handleGet = async (req, res) => {
    const { id } = req.params;
    if (!idValidate(id)) {
        return res.status(404).json({ success: false, message: 'Thông tin người dùng không tồn tại.' });
    }

    try {
        const user = await User.findById(id).select('-account -__v -updatedAt -createdAt');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Thông tin người dùng không tồn tại.' });
        }
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleUpdate = async (req, res) => {
    const account = req.user;
    try {
        const user = await User.findOne({ account: account.id });
        const { name, phone, email, image, description } = req.body;
        if (!user) {
            await User.create({ name, phone, email, image, description, account: account._id });
            res.status(201).json({ success: true, message: 'Tạo thông tin thành công.' });
        }
        if (user.image) {
            try {
                const storageRef = ref(storage, user.image.ref);
                await deleteObject(storageRef);
            } catch (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
        }

        await User.findByIdAndUpdate(user._id, { name, phone, email, image, description });
        res.status(500).json({ success: true, message: 'Cập nhật thông tin thành công.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
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
                { name: { $regex: req.query.value, $options: 'i' } },
                { phone: { $regex: req.query.value, $options: 'i' } },
                { email: { $regex: req.query.value, $options: 'i' } },
                { description: { $regex: req.query.value, $options: 'i' } }
            ]
        }
        : {};
    try {
        const count = await User.countDocuments({ ...query });
        const users = await User.find({ ...query })
            .select('-account -__v -updatedAt -createdAt')
            .sort(sortCriteria)
            .limit(size)
            .skip(size * (page - 1));
        res.json({ success: true, data: { users, page, pages: Math.ceil(count / size) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleUserExists = async (req, res) => {
    const account = req.user;
    const user = await User.findOne({ account: account._id });
    if (!user) {
        return res.json({ success: true, exists: false });
    }
    res.json({ success: true, exists: true });
}

export const handleChangePassword = async (req, res) => {
    const account = req.user;
    const { password, update, confirm } = req.body;
    const updateAccount = await Account.findById(account._id);
    const isMatch = await bcrypt.compare(password, updateAccount.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác.' });
    }

    if (isNullOrWhitespace(update)) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới không hợp lệ.' });
    }

    if (update !== confirm) {
        return res.status(400).json({ success: false, message: 'Xác nhận mật khẩu không lớp.' });
    }
    const hashedPassword = await bcrypt.hash(update, 10);
    await Account.findByIdAndUpdate(updateAccount._id, { password: hashedPassword });
    await RefreshToken.deleteMany({ account: account._id });

    res.clearCookie(COOKIE_NAME, { path: AUTH_ENDPOINT });
    res.status(200).json({ success: true, message: 'Đổi mât khẩu thành công.' });
}
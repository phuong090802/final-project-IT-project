import Account from '../models/Account.js';
import Topic from '../models/Topic.js';
import bcrypt from 'bcrypt';
import { idValidate } from '../utils/commonUtils.js';
import RefreshToken from '../models/RefreshToken.js';


export const handleCreate = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Account.create({ username: username.toLowerCase(), password: hashedPassword });
        res.status(201).json({ success: true, message: 'Tạo tài khoản thành công.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleDisable = async (req, res) => {
    const { id } = req.params;
    if (!idValidate(id)) {
        return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }

    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });
        }
        await Account.findByIdAndUpdate(id, { status: false });
        await RefreshToken.deleteMany({ account: account._id });
        res.json({ success: true, message: `Khóa tài khoản ${account.username} thành công.` });
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
    const account = req.user;
    const query = !req.query.value ? { _id: { $ne: account._id } }
        : {
            $and: [
                {
                    $or: [
                        {
                            username: {
                                $regex: req.query.value,
                                $options: 'i'
                            }
                        },
                        {
                            role: {
                                $regex: req.query.value,
                                $options: 'i'
                            }
                        },
                        (req.query.value === 'true' || req.query.value === 'false') ? { status: req.query.value } : {}
                    ]
                },
                { _id: { $ne: account._id } }
            ]
        };

    try {
        const count = await Account.countDocuments({ ...query })
            .where('_id')
            .ne(account._id);

        const users = await Account.find({ ...query })
            .select('-password -__v -updatedAt -createdAt')
            .sort(sortCriteria)
            .limit(size)
            .skip(size * (page - 1));
        res.json({ success: true, data: { users, page, pages: Math.ceil(count / size) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const handleCountAccounts = async (req, res) => {
    const account = req.user;
    const count = await Account.countDocuments()
        .where('_id')
        .ne(account._id);
    res.json({ success: true, count });
}

export const handleCountTopics = async (req, res) => {
    const count = await Topic.countDocuments();
    res.json({ success: true, count });
}

export const handleChangePassword = async (req, res) => {
    const { id } = req.params;
    if (!idValidate(id)) {
        return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }

    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không thể trống.' });
        }

        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });

        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await Account.findByIdAndUpdate(account._id, { password: hashedPassword });
        await RefreshToken.deleteMany({ account: account._id });
        res.json({ success: true, message: 'Đặt lại mật khẩu thành công.' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
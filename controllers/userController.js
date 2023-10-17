import UserDetails from '../models/UserDetails.js';

export const handleCreateUserDetails = async (req, res) => {
    const user = req.user
    if (user) {
        try {
            const { name, phone, email, image, description } = req.body;
            await UserDetails.create({ name: name, phone: phone, email: email, image: image, description: description, user: user._id });
            return res.status(500).json({ error: 'Tạo thông tin thành công.' });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    res.status(401).json({ error: 'Không đủ quyền truy cập.' });
}

export const handleGet = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Thông tin người dùng không tồn tại.' });
    }
    try {
        const UserDetailss = await UserDetails.findById(id);
        if (UserDetailss) {
            return res.status.json(UserDetailss);
        }
        return res.status(404).json({ error: 'Thông tin người dùng không tồn tại.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const handleUpdateUserDetails = async (req, res) => {
    const user = req.user
    if (user) {
        try {
            const { name, phone, email, image, description } = req.body;
            await UserDetails.updateOne({ user: user._id }, { $set: { name: name, phone: phone, email: email, image: image, description: description, user: user._id } });
            return res.status(500).json({ error: 'Cập nhật thông tin thành công.' });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    res.status(401).json({ error: 'Không đủ quyền truy cập.' });
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
        res.json({ users, page, pages: Math.ceil(count / size) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const handleUserDetailsExists = async (req, res) => {
    const user = req.user;
    if (user) {
        const userDetails = UserDetails.findOne({ user: user._id });
        if (userDetails) {
            return res.json({exists: true});
        }
        res.json({exists: false});
    }
    res.status(401).json({ error: 'Không đủ quyền truy cập.' });
}
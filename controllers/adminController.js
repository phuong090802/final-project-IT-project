import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const handleCreateUser = async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name: name, phone: phone, email: email, password: hashedPassword });
        res.status(201).json({ success: 'Tạo tài khoản thành công.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


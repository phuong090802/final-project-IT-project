import bcrypt from 'bcrypt';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { generateRefreshToken, generateChildrenRefreshToken } from '../utils/jwtUtils.js';
import { setCookieAndSendResponse } from '../utils/cookieUtils.js';

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email và password không thể trống.' });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(401).json({ error: 'Vui lòng kiểm lại email và password.' });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (isMatch) {
        const refreshToken = await generateRefreshToken(user._id);
        return setCookieAndSendResponse(res, refreshToken, user);
    }
    res.status(401).json({ error: 'Vui lòng kiểm lại email và password.' });
};

export const handleRefreshToken = async (req, res) => {
    const refreshtTokenValue = req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOne({ token: refreshtTokenValue });
    if (refreshToken) {
        const user = await User.findById(refreshToken.user);
        await RefreshToken.updateOne({ _id: refreshToken._id }, { $set: { status: false } });
        const parentId = refreshToken.parent ?? refreshToken._id;
        const nextRefreshToken = await generateChildrenRefreshToken(user._id, parentId);
        return setCookieAndSendResponse(res, nextRefreshToken, user);
    }
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.status(401).json({ error: 'Không đủ quyền truy cập.' });
};

export const handleLogout = async (req, res) => {
    const refreshtTokenValue = req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOne({ token: refreshtTokenValue });
    if (refreshToken) {
        const parentId = refreshToken.parent ?? refreshToken._id;
        await RefreshToken.deleteMany({ parent: parentId });
        await RefreshToken.findByIdAndRemove(parentId);
    }
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ success: 'Đăng xuất thành công.' });
}


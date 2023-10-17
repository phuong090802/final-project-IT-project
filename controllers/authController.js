import bcrypt from 'bcrypt';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { generateRefreshToken, generateChildrenRefreshToken, deleteBranchToken } from '../utils/tokenUtils.js';
import { setCookieAndSendResponse, clearCookie } from '../utils/cookieUtils.js';

export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Tên đăng nhập và mật khẩu không thể trống.' });
    }
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Vui lòng kiểm lại tên đăng nhập và mật khẩu.' });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (isMatch) {
        const refreshToken = await generateRefreshToken(user._id);
        return setCookieAndSendResponse(res, refreshToken, user);
    }
    res.status(401).json({ success: false, message: 'Vui lòng kiểm lại tên đăng nhập và mật khẩu' });
};

export const handleRefreshToken = async (req, res) => {
    const refreshtTokenValue = req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOne({ token: refreshtTokenValue });
    if (refreshToken) {
        const parentId = refreshToken.parent ?? refreshToken._id;
        if (refreshToken.status) {
            const user = await User.findById(refreshToken.user);
            await RefreshToken.findByIdAndUpdate(refreshToken._id, { status: false });
            const nextRefreshToken = await generateChildrenRefreshToken(user._id, parentId);
            return setCookieAndSendResponse(res, nextRefreshToken, user);
        }
        await deleteBranchToken(parentId);
        return clearCookie(res, false, 'Không đủ quyền truy cập.');
    }
    try {
        const token = atob(refreshtTokenValue);
        tokenObj = JSON.parse(token);
        const parentToken = await RefreshToken.findById(tokenObj.p);
        const parentId = parentToken.parent || parentToken._id;
        await deleteBranchToken(parentId);
    } catch {
        return clearCookie(res, false, 'Không đủ quyền truy cập.');
    }
    clearCookie(res, false, 'Không đủ quyền truy cập.');
};

export const handleLogout = async (req, res) => {
    const refreshtTokenValue = req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOne({ token: refreshtTokenValue });
    if (refreshToken) {
        const parentId = refreshToken.parent || refreshToken._id;
        await deleteBranchToken(parentId);
    }
    clearCookie(res, true, 'Đăng xuất thành công.');
}


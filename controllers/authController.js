import bcrypt from 'bcrypt';
import Account from '../models/Account.js';
import RefreshToken from '../models/RefreshToken.js';
import { generateRefreshToken, generateChildrenRefreshToken, deleteABranch } from '../utils/tokenUtils.js';
import { setCookiesAndResponse, clearCookies } from '../utils/cookiesUtils.js';

export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Tên đăng nhập và mật khẩu không thể trống.' });
    }

    const account = await Account.findOne({ username: username.toLowerCase() });
    if (!account) {
        return res.status(401).json({ success: false, message: 'Vui lòng kiểm lại tên đăng nhập và mật khẩu.' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Vui lòng kiểm lại tên đăng nhập và mật khẩu.' });
    }
    const token = await generateRefreshToken(account._id);
    setCookiesAndResponse(res, token, account);
};

export const handleRefreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken) {
        try {
            const token = Buffer.from(token, ENCODING).toString();
            tokenObj = JSON.parse(token);
            const parentToken = await RefreshToken.findById(tokenObj.p);
            const parentId = parentToken.parent || parentToken._id;
            await deleteABranch(parentId);
            return clearCookies(res, false, 'Không đủ quyền truy cập.');
        } catch (err) {
            return clearCookies(res, false, err.message);
        }
    }

    const parent = refreshToken.parent || refreshToken._id;
    if (!refreshToken.status) {
        await deleteABranch(parent);
        return clearCookies(res, false, 'Không đủ quyền truy cập.');
    }

    const account = await Account.findById(refreshToken.account);
    await RefreshToken.findByIdAndUpdate(refreshToken._id, { status: false });
    const nextRefreshToken = await generateChildrenRefreshToken(account._id, parent);
    setCookiesAndResponse(res, nextRefreshToken, account);

};

export const handleLogout = async (req, res) => {
    const token = req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOne({ token });
    if (refreshToken) {
        const parentId = refreshToken.parent || refreshToken._id;
        await deleteABranch(parentId);
    }
    clearCookies(res, true, 'Đăng xuất thành công.');
}


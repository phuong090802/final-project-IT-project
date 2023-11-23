import User from '../models/user.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import {
    sendToken,
    getRefreshToken,
    deleteToken,
    clearToken,
    getNextRefreshToken
} from '../utils/tokenUtils.js';
import ErrorHandler from '../utils/errorHandler.js';
import RefreshToken from '../models/refreshToken.js';

export const handleLogin = catchAsyncErrors(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ErrorHandler('Vui lòng nhập tên đăng nhập và mật khẩu', 400));
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Tên đăng nhập hoặc mật khẩu không hợp lệ', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Tên đăng nhập hoặc mật khẩu không hợp lệ', 401));
    }
    const token = await getRefreshToken(user);

    return sendToken(user, token, res);
});

export const handleLogout = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.refreshToken;

    if (token) {
        const refreshToken = await RefreshToken.findOne({ token });
        if (refreshToken) {
            const parent = refreshToken.parent || refreshToken._id;
            await deleteToken(parent);
        }

    }
    clearToken(res);

    res.json({
        success: true,
        message: 'Đăng xuất thành công'
    })
});

export const handleRefreshToken = catchAsyncErrors(async (req, res, next) => {

    const token = req.cookies.refreshToken;
    if (!token) {
        return next(new ErrorHandler('Yêu cầu không hợp lệ', 400));
    }

    const refreshToken = await RefreshToken.findOne({ token });

    if (!refreshToken) {
        try {
            const tokenEncoded = Buffer.from(token, 'base64url').toString();
            const tokenObject = JSON.parse(tokenEncoded);
            const parentToken = await RefreshToken.findById(tokenObject.p);
            const parent = parentToken.parent || parentToken._id;
            await deleteToken(parent);
            return next(new ErrorHandler('Yêu cầu không hợp lệ', 400));
        } catch {
            clearToken(res);
            return next(new ErrorHandler('Yêu cầu không hợp lệ', 400));
        }
    }

    const parent = refreshToken.parent || refreshToken._id;
    if (!refreshToken.status) {
        await deleteToken(parent);
        clearToken(res);
        return next(new ErrorHandler('Yêu cầu không hợp lệ', 400));
    }

    const user = await User.findById(refreshToken.user);
    if (refreshToken.parent == null) {
        await RefreshToken.findByIdAndUpdate(refreshToken._id, { status: false });

    }
    await RefreshToken.deleteMany({ parent });

    const nextRefreshToken = await getNextRefreshToken(user._id, parent);

    return sendToken(user, nextRefreshToken, res);
});


export const handleGetCurrentUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler('Không tìm thấy người dùng', 404));
    }
    const userData = {
        _id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
    };
    res.json({
        success: true,
        user: userData,
    })
});
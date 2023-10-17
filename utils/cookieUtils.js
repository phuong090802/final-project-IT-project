import { generateToken } from './tokenUtils.js';

export const setCookieAndSendResponse = (res, refreshToken, user) => {
    res.cookie('refreshToken', refreshToken.token, {
        httpOnly: true,
        expires: refreshToken.isExpiredAt,
        path: '/api/auth'
    });
    res.json({
        success: true,
        data: {
            id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id)
        }
    });
};

export const clearCookie = (res, success, message) => {
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.status(401).json({ success: success, message: message });
}
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
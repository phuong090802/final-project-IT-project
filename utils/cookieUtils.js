import { generateToken } from './tokenUtils.js';

export const setCookieAndSendResponse = (res, refreshToken, user) => {
    res.cookie('refreshToken', refreshToken.token, {
        httpOnly: true,
        expires: refreshToken.isExpiredAt,
        path: '/api/auth'
    });
    res.json({
        id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    });
};
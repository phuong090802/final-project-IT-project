import { generateToken } from './tokenUtils.js';
import { COOKIE_NAME, AUTH_ENDPOINT } from '../constants/cookiesConstant.js';

export const setCookiesAndResponse = (res, token, account) => {
    res.cookie(COOKIE_NAME, token.token, {
        httpOnly: true,
        expires: token.expires,
        path: AUTH_ENDPOINT
    });
    res.json({
        success: true,
        data: {
            id: account._id,
            username: account.username,
            role: account.role,
            token: generateToken(account._id)
        }
    });
};

export const clearCookies = (res, success, message) => {
    res.clearCookie(COOKIE_NAME, { path: AUTH_ENDPOINT });
    res.status(401).json({ success: success, message: message });
}
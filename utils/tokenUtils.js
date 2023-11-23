import RefreshToken from '../models/refreshToken.js';
import { nanoid } from 'nanoid';


export const sendToken = (user, refreshToken, res) => {
    const token = user.getAccessToken();
    const options = {
        expires: refreshToken.expires,
        httpOnly: true,
        path: '/api/v1/auth',
        sameSite: 'None',
        secure: true,
    }
    const userData = {
        _id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
    };
    res.cookie('refreshToken', refreshToken.token, options).json({
        success: true,
        user: userData,
        token: token
    });
}

export const clearToken = (res) => {
    res.clearCookie('refreshToken', {
        path: '/api/v1/auth',
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
}

export const getRefreshToken = async (user) => {
    return await RefreshToken.create({
        token: nanoid(),
        expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        user
    });
};

export const getNextRefreshToken = async (user, parent) => {
    const tokenObj = { _: nanoid(10), p: parent };
    const token = Buffer.from(JSON.stringify(tokenObj)).toString('base64url');
    await RefreshToken.deleteMany({ parent });
    return await RefreshToken.create({
        token,
        expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        user,
        parent
    });
};

export const deleteToken = async (parent) => {
    await RefreshToken.deleteMany({ parent });
    await RefreshToken.findByIdAndDelete({ _id: parent });
}
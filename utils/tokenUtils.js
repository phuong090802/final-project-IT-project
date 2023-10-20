import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';
import { nanoid } from 'nanoid';
import { EXPIRES_IN, ENCODING } from '../constants/tokenConstant.js';

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: EXPIRES_IN
    });
};

export const generateRefreshToken = async (account) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    return await RefreshToken.create({ token: nanoid(), expires, account });
};

export const generateChildrenRefreshToken = async (account, parent) => {
    const tokenObj = { _: nanoid(10), p: parent };
    const token = Buffer.from(JSON.stringify(tokenObj)).toString(ENCODING);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    await RefreshToken.deleteMany({ parent });
    return await RefreshToken.create({ token, expires, account, parent });
};

export const deleteABranch = async (parent) => {
    await RefreshToken.deleteMany({ parent });
    await RefreshToken.findByIdAndRemove(parent);
}


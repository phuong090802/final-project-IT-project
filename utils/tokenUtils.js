import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';
import { nanoid } from 'nanoid';

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: '5m',
    });
};

export const generateRefreshToken = async (id) => {
    const token = nanoid();
    const currentDate = new Date();
    const isExpiredAt = new Date(currentDate);
    isExpiredAt.setDate(currentDate.getDate() + 7);
    return await RefreshToken.create({ token: token, isUsedAt: currentDate, isExpiredAt: isExpiredAt, user: id });
};

export const generateChildrenRefreshToken = async (id, parentId) => {
    const token = nanoid();
    const currentDate = new Date();
    const isExpiredAt = new Date(currentDate);
    isExpiredAt.setDate(currentDate.getDate() + 7);
    return await RefreshToken.create({ token: token, isUsedAt: currentDate, isExpiredAt: isExpiredAt, user: id, parent: parentId });
};



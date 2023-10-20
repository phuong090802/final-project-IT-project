import jwt from 'jsonwebtoken';
import Account from '../models/Account.js';
import { ROLE_USER, ROLE_ADMIN } from '../constants/dbConstant.js';

export const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const account = await Account.findById(decoded.id).select('-password');
        if (!account.status) {
            return res.status(401).json({ success: false, message: 'Tài khoản đã bị khóa' });
        }
        req.user = account;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
}

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== ROLE_ADMIN) {
        return res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
    }
    next();
};

export const isUser = (req, res, next) => {
    if (!req.user || req.user.role !== ROLE_USER) {
        return res.status(401).json({ success: false, message: 'Không đủ quyền truy cập.' });
    }
    next();
};

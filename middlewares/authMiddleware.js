import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { USER, ADMIN } from '../constants/roleConstant.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Không đủ quyền truy cập.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Không đủ quyền truy cập.' });
    }

    const verifyTokenPromise = new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });

    verifyTokenPromise.then(async (decoded) => {
        const user = await User.findById(decoded.id).select('-password');
        if (user.status) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({ error: 'Tài khoản đã bị khóa' });
        }
    })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
}

export const roleAdmin = (req, res, next) => {
    if (req.user && req.user.role === ADMIN) {
        next();
    } else {
        res.status(401).json({ error: 'Không đủ quyền truy cập.' });
    }
};

export const roleUser = (req, res, next) => {
    if (req.user && req.user.role === USER) {
        next();
    } else {
        res.status(401).json({ error: 'Không đủ quyền truy cập.' });
    }
};


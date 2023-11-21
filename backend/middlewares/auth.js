import ErrorHandler from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import catchAsyncErrors from './catchAsyncErrors.js';

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return next(new ErrorHandler('Đăng nhập trước khi truy cập vào tài nguyên này', 403));
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(new ErrorHandler('Đăng nhập trước khi truy cập vào tài nguyên này', 403));
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
});

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) không được phép truy cập vào tài nguyên này`, 403));
        }
        next();
    }
}
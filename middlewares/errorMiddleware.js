import ErrorHandler from '../utils/errorHandler.js';

export default function errorMiddleware(err, req, res, next) {
    err.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';


    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
        const message = `Giá trị ${err.path} không hợp lệ `;
        error = new ErrorHandler(message, 400);
    }

    if (err.code === 11000) {
        let field = 'Giá trị';
        if (Object.keys(err.keyValue).includes('username')) {
            field = 'Tên đăng nhập';
        }
        const message = `${field} đã tồn tại`;
        error = new ErrorHandler(message, 409);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'Xác thực không thành công. Vui lòng đăng nhập lại';
        error = new ErrorHandler(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Xác thực không thành công. Vui lòng đăng nhập lại';
        error = new ErrorHandler(message, 401);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorHandler(message, 400);
    }

    res.status(error.status).json({
        success: false,
        message: error.message || 'Lỗi Internal Server'
    });
}
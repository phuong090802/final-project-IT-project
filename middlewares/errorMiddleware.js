import ErrorHandler from '../utils/errorHandler.js';

export default function errorMiddleware(err, req, res, next) {
    err.status = err.status || 500;
    err.detail = err.detail || 'Internal Server Error';
    err.message = err.message || 'Internal Server Error';
    err.code = err.code || 10000;
    // console.log(err);
    let error = { ...err };
    error.message = err.message;
    error.detail = err.detail;
    error.code = err.code;

    if (err.name === 'CastError') {
        const message = `Giá trị ${err.path} không hợp lệ `;
        error = new ErrorHandler(400, message, err.message, 10028);
    }

    if (err.code === 11000) {
        let field = 'Giá trị';
        let code = 10029;
        if (Object.keys(err.keyValue).includes('username')) {
            field = 'Tên đăng nhập';
            code = 10030;
        }
        if (Object.keys(err.keyValue).includes('name')) {
            field = 'Tên đề tài';
            code = 10031;
        }
        if (Object.keys(err.keyValue).includes('email')) {
            field = 'Email';
            code = 10032;
        }
        if (Object.keys(err.keyValue).includes('phone')) {
            field = 'Số điện thoại';
            code = 10033;
        }
        const message = `${field} đã tồn tại`;
        error = new ErrorHandler(409, message, err.message, code);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'Xác thực không thành công. Vui lòng đăng nhập lại';
        error = new ErrorHandler(401, message, err.message, 10034);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Xác thực không thành công. Vui lòng đăng nhập lại';
        error = new ErrorHandler(401, message, err.message, 10035);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorHandler(400, message, err.message, 10036);
    }

    res.status(error.status).json({
        success: false,
        message: error.message || 'Lỗi Internal Server',
        detail: error.detail || 'Lỗi Internal Server',
        code: error.code,
    });
}
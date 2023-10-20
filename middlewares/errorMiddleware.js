export const handleNotFound = (req, res, next) => {
    const error = new Error(`${req.originalUrl} không tồn tại.`);
    res.status(404);
    next(error);
};

export const handleErrors = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ success: false, message: err.message });
};

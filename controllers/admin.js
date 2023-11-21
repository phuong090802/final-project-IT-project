import User from '../models/user.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';

export const handleCreateUser = catchAsyncErrors(async (req, res, next) => {
    const { username, password } = req.body;

    await User.create({
        username,
        password,
    });

    res.json({
        success: true,
        message: 'Tạo tài khoản thành công'
    })
});
import User from '../models/user.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../utils/errorHandler.js';
import RefreshToken from '../models/refreshToken.js';

export const handleUpdatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
        return next(new ErrorHandler('Không tìm thấy người dùng', 404));
    }

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Mật khẩu cũ không chính xác', 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    await RefreshToken.deleteMany({ user });

    res.json({
        success: true,
        message: 'Cập nhật mật khẩu thành công'
    });
});


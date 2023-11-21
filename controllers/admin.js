import User from '../models/user.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import { UserAPIFeatures } from '../utils/APIFeatures.js';
import { format, parseISO } from 'date-fns';
import vi from 'date-fns/locale/vi/index.js';

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

export const handleGetAllUser = catchAsyncErrors(async (req, res, next) => {
    const { size } = req.query;
    const userQuery = User.find({ _id: { $ne: req.user._id } });

    const apiFeatures = new UserAPIFeatures(userQuery, req.query)
        .search()
        .filter();

    let Alluser = await apiFeatures.query;
    const totals = Alluser.length;

    const apiFeaturesPagination = new UserAPIFeatures(User.find(userQuery), req.query)
        .search()
        .filter()
        .pagination(size);

    Alluser = await apiFeaturesPagination.query;

    const users = Alluser.map(user => {
        const createdAtDate = user.createdAt.toJSON();
        const updatedAtDate = user.updatedAt.toJSON();

        const createdAt = formatVietnameseDate(createdAtDate, 'HH:mm - EEEE-dd-MM-yyyy');
        const updatedAt = formatVietnameseDate(updatedAtDate, 'HH:mm - EEEE-dd-MM-yyyy');

        return { _id: user._id, username: user.username, role: user.role, status: user.status, createdAt, updatedAt };
    })

    res.json({
        success: true,
        users,
        size,
        totals
    })
});


function formatVietnameseDate(date) {
    const parsedDate = parseISO(date);

    const dayOfWeek = format(parsedDate, 'EEEE', { locale: vi });

    const time = format(parsedDate, 'HH:mm');

    const formattedDate = format(parsedDate, "'Ngày' dd-MM-yyyy");

    const finalFormattedDate = `${time} - ${dayOfWeek}-${formattedDate}`;

    return finalFormattedDate;
}
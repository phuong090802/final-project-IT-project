import User from '../models/user.js';
import UserDetails from '../models/userDetails.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../utils/errorHandler.js';
import RefreshToken from '../models/refreshToken.js';
import Topic from '../models/topic.js';
import {
    TopicAPIFeatures,
    UserAPIFeatures
} from '../utils/APIFeatures.js';

import handleFormatVietnameseDateTopic from '../utils/dateUtils.js';


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

export const handleCreateTopic = catchAsyncErrors(async (req, res, next) => {
    const { name, description, beginAt, endAt } = req.body;
    const user = await User.findById(req.user.id);
    await Topic.create({
        name,
        description,
        beginAt,
        endAt,
        instructor: user
    });

    res.status(201).json({
        success: true,
        message: 'Tạo tài đề tài thành công'
    });
});

export const handleUpdateTopic = catchAsyncErrors(async (req, res, next) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
        return next(new ErrorHandler('Không tìm thấy đề tài', 404));
    }

    const user = await User.findById(req.user.id);
    if (!topic.instructor.equals(user._id)) {
        return next(new ErrorHandler('Thao tác không hợp lệ', 403));
    }

    const { name, description, beginAt, endAt } = req.body;

    await Topic.findByIdAndUpdate(req.params.id, { name, description, beginAt, endAt });

    res.json({
        success: true,
        message: 'Cập nhật đề tài thành công'
    });
});

export const handleDeleteToplic = catchAsyncErrors(async (req, res, next) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
        return next(new ErrorHandler('Không tìm thấy đề tài', 404));
    }

    await topic.deleteOne();
    res.json({
        success: true,
        message: 'Xóa đề tài thành công'
    });
});

export const handleGetAllTopicOfCurrentUser = catchAsyncErrors(async (req, res, next) => {
    const { size } = req.query;
    const topicQuery = Topic.find({ instructor: req.user.id });

    const apiFeatures = new TopicAPIFeatures(topicQuery, req.query)
        .search();

    let allTopics = await apiFeatures.query;
    const totals = allTopics.length;

    const apiFeaturesPagination = new TopicAPIFeatures(Topic.find(topicQuery), req.query)
        .search()
        .pagination(size);

    allTopics = await apiFeaturesPagination.query;
    const format = 'HH:mm - EEEE-dd-MM-yyyy';


    const topics = allTopics.map(topic => {

        const dateFormatted = handleFormatVietnameseDateTopic(topic);

        return {
            _id: topic._id,
            name: topic.name,
            description: topic.description,
            ...dateFormatted,
            instructor: topic.instructor,
        };
    })

    res.json({
        success: true,
        topics,
        size: Number(size),
        totals
    })
});



export const handleGetUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id, role: { $ne: 'admin' } });

    if (!user) {
        return next(new ErrorHandler('Không tìm thấy người dùng', 404));
    }

    const userData = {
        _id: user.id,
        name: user.name
    }

    const userDetails = await UserDetails.findOne({ user });

    if (userDetails) {
        userData.phone = userDetails.phone;
        userData.email = userDetails.email;
        userData.image = userDetails.image.url;
        userData.degree = userDetails.degree;

    };

    res.json({
        success: true,
        user: userData,
    })
});

export const handleGetAllUser = catchAsyncErrors(async (req, res, next) => {
    const { size } = req.query;
    const userQuery = User.find({ role: { $ne: 'admin' } });

    const apiFeatures = new UserAPIFeatures(userQuery, req.query)
        .search();

    let allUser = await apiFeatures.query;
    const totals = allUser.length;

    const apiFeaturesPagination = new UserAPIFeatures(User.find(userQuery), req.query)
        .search()
        .pagination(size);

    allUser = await apiFeaturesPagination.query;

    const users = await Promise.all(allUser.map(async (user) => {
        const userDetails = await UserDetails.findOne({ user });
        const userData = {
            _id: user.id,
            name: user.name
        }
        if (userDetails) {
            userData.phone = userDetails.phone;
            userData.email = userDetails.email;
            userData.image = userDetails.image.url;
            userData.degree = userDetails.degree;

        };
        return userData;
    }));


    res.json({
        success: true,
        users,
        size: Number(size),
        totals
    })
});

export const handleGetTopic = catchAsyncErrors(async (req, res, next) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
        return next(new ErrorHandler('Không tìm thấy đề tài', 404));
    }

    const dateFormatted = handleFormatVietnameseDateTopic(topic);


    const topicData = {
        _id: topic._id,
        name: topic.name,
        description: topic.description,
        ...dateFormatted,
        instructor: req.user.id
    }


    res.json({
        success: true,
        topic: topicData
    });
});


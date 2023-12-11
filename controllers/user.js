import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import RefreshToken from '../models/refreshToken.js';
import Topic from '../models/topic.js';
import User from '../models/user.js';
import UserDetails from '../models/userDetails.js';
import { TopicAPIFeatures, UserAPIFeatures } from '../utils/APIFeatures.js';
import ErrorHandler from '../utils/errorHandler.js';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebaseConfig.js';

export const handleUpdatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(
      new ErrorHandler(
        404,
        'Không tìm thấy người dùng',
        `Không tìm thấy người dùng để cập nhật mật khẩu`,
        10013
      )
    );
  }

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(
      new ErrorHandler(
        400,
        'Mật khẩu cũ không chính xác',
        `Nhập sai mật khẩu cũ`,
        10014
      )
    );
  }

  user.password = req.body.newPassword;
  await user.save();
  await RefreshToken.deleteMany({ user });

  res.json({
    success: true,
    message: 'Cập nhật mật khẩu thành công',
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
    instructor: user,
  });

  res.status(201).json({
    success: true,
    message: 'Tạo tài đề tài thành công',
  });
});

export const handleUpdateTopic = catchAsyncErrors(async (req, res, next) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) {
    return next(
      new ErrorHandler(
        404,
        'Không tìm thấy đề tài',
        `Không tìm thấy đề tài với id: ${req.params.id}`,
        10015
      )
    );
  }

  const user = await User.findById(req.user.id);
  if (!topic.instructor.equals(user._id)) {
    return next(
      new ErrorHandler(
        403,
        'Thao tác không hợp lệ',
        `Chỉnh sửa đề tài: ${req.params.id} không phải của bản thân`,
        10016
      )
    );
  }

  const { name, description, beginAt, endAt } = req.body;

  await Topic.findByIdAndUpdate(req.params.id, {
    name,
    description,
    beginAt,
    endAt,
  });

  res.json({
    success: true,
    message: 'Cập nhật đề tài thành công',
  });
});

export const handleDeleteTopic = catchAsyncErrors(async (req, res, next) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) {
    return next(
      new ErrorHandler(
        404,
        'Không tìm thấy đề tài',
        `Không tìm thấy đề tài với id: ${req.params.id}`,
        10017
      )
    );
  }
  const user = await User.findById(req.user.id);
  if (!topic.instructor.equals(user._id)) {
    return next(
      new ErrorHandler(
        403,
        'Thao tác không hợp lệ',
        `Xóa đề tài: ${req.params.id} không phải của bản thân`,
        10018
      )
    );
  }
  await topic.deleteOne();
  res.json({
    success: true,
    message: 'Xóa đề tài thành công',
  });
});

export const handleGetAllTopicOfCurrentUser = catchAsyncErrors(
  async (req, res, next) => {
    const { size } = req.query;
    const topicQuery = Topic.find({ instructor: req.user.id });

    const apiFeatures = new TopicAPIFeatures(topicQuery, req.query).search();

    let listTopics = await apiFeatures.query;
    const totals = listTopics.length;

    const apiFeaturesPagination = new TopicAPIFeatures(
      Topic.find(topicQuery),
      req.query
    )
      .search()
      .pagination(size);

    listTopics = await apiFeaturesPagination.query;

    const topics = listTopics.map((topic) => ({
      _id: topic._id,
      name: topic.name,
      description: topic.description,
      beginAt: topic.beginAt,
      endAt: topic.endAt,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    }));

    res.json({
      success: true,
      topics,
      size: Number(size),
      totals,
    });
  }
);

export const handleGetUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    role: { $ne: 'admin' },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        404,
        'Không tìm thấy người dùng',
        `Không tìm thấy người dùng với id: ${req.params.id}`,
        10019
      )
    );
  }

  const userData = {
    _id: user.id,
    name: user.name,
  };

  const userDetails = await UserDetails.findOne({ user });

  userData.phone = userDetails?.phone || null;
  userData.email = userDetails?.email || null;
  userData.image = userDetails?.image?.url || null;
  userData.degree = userDetails?.degree || null;

  res.json({
    success: true,
    user: userData,
  });
});

export const handleGetAllUser = catchAsyncErrors(async (req, res, next) => {
  const { size } = req.query;
  const userQuery = User.find({ role: { $ne: 'admin' } });

  const apiFeatures = new UserAPIFeatures(userQuery, req.query).search();

  let allUser = await apiFeatures.query;
  const totals = allUser.length;

  const apiFeaturesPagination = new UserAPIFeatures(
    User.find(userQuery),
    req.query
  )
    .search()
    .pagination(size)
    .sort();

  allUser = await apiFeaturesPagination.query;

  const users = await Promise.all(
    allUser.map(async (user) => {
      const userDetails = await UserDetails.findOne({ user });
      const userData = {
        _id: user.id,
        name: user.name,
      };
      userData.phone = userDetails?.phone || null;
      userData.email = userDetails?.email || null;
      userData.image = userDetails?.image?.url || null;
      userData.degree = userDetails?.degree || null;

      return userData;
    })
  );

  res.json({
    success: true,
    users,
    size: Number(size),
    totals,
  });
});

export const handleGetTopic = catchAsyncErrors(async (req, res, next) => {
  const topic = await Topic.findOne({
    _id: req.params.id,
    instructor: req.user.id,
  });
  if (!topic) {
    return next(
      new ErrorHandler(
        404,
        'Không tìm thấy đề tài',
        `Không tìm thấy đề tài với id: ${req.params.id}`,
        10020
      )
    );
  }

  const topicData = {
    _id: topic._id,
    name: topic.name,
    description: topic.description,
    beginAt: topic.beginAt,
    endAt: topic.endAt,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
  };

  res.json({
    success: true,
    topic: topicData,
  });
});

export const handleGetCurrentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(
      new ErrorHandler(
        404,
        'Không tìm thấy người dùng',
        `Không tìm thấy người dùng để xem chi tiết bản thân`,
        10021
      )
    );
  }

  const userDetails = await UserDetails.findOne({ user });

  const userData = {
    _id: user.id,
    phone: userDetails?.phone || null,
    email: userDetails?.email || null,
    image: userDetails?.image?.url || null,
    degree: userDetails?.degree || null,
  };

  res.json({
    success: true,
    user: userData,
  });
});

export const handleUpdateUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(
      new ErrorHandler(
        404,
        'Không tìm thấy người dùng',
        `Không tìm thấy người dùng để cập nhật thông tin bản thân`,
        10022
      )
    );
  }

  const { phone, email, image, degree } = req.body;

  const userDetails = await UserDetails.findOne({ user });

  if (userDetails) {
    if (image) {
      if (userDetails.image) {
        try {
          const storageRef = ref(storage, userDetails.image.ref);
          await deleteObject(storageRef);
        } catch (err) {
          console.log(err);
          return next(
            new ErrorHandler(500, 'Lỗi gỡ ảnh cũ của người dùng', err, 10040)
          );
        }
      }
      userDetails.image = image;
    }

    userDetails.phone = phone;
    userDetails.email = email;
    userDetails.degree = degree;
    await userDetails.save();
  } else {
    await UserDetails.create({
      phone,
      email,
      image,
      degree,
      user,
    });
  }

  res.json({
    success: true,
    message: 'Cập nhật thông tin thành công',
  });
});

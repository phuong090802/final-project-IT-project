import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Topic from '../models/topic.js';
import { TopicAPIFeatures } from '../utils/APIFeatures.js';
import ErrorHandler from '../utils/errorHandler.js';

export const handleGetAllTopic = catchAsyncErrors(async (req, res, next) => {
    const { size } = req.query;
    const topicQuery = Topic.find();

    const apiFeatures = new TopicAPIFeatures(topicQuery, req.query)
        .search();

    let allTopics = await apiFeatures.query;
    const totals = allTopics.length;

    const apiFeaturesPagination = new TopicAPIFeatures(Topic.find(topicQuery), req.query)
        .search()
        .pagination(size);

    allTopics = await apiFeaturesPagination.query;


    const topics = allTopics.map(topic => ({
        _id: topic._id,
        name: topic.name,
        description: topic.description,
        beginAt: topic.beginAt,
        endAt: topic.endAt,
        instructor: topic.instructor,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,

    }))

    res.json({
        success: true,
        topics,
        size: Number(size),
        totals
    })
});

export const handleGetTopic = catchAsyncErrors(async (req, res, next) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
        return next(new ErrorHandler(
            404,
            'Không tìm thấy đề tài',
            `Không tìm thấy đề tài với id: ${req.params.id}`,
            10012));
    }

    const topicData = {
        _id: topic._id,
        name: topic.name,
        description: topic.description,
        beginAt: topic.beginAt,
        endAt: topic.endAt,
        instructor: topic.instructor,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,
    }

    res.json({
        success: true,
        topic: topicData
    });
});


export const handleGetAllTopicByUserId = catchAsyncErrors(async (req, res, next) => {
    const { size } = req.query;
    const topicQuery = Topic.find({ instructor: req.params.id });

    const apiFeatures = new TopicAPIFeatures(topicQuery, req.query)
        .search();

    let allTopics = await apiFeatures.query;
    const totals = allTopics.length;

    const apiFeaturesPagination = new TopicAPIFeatures(Topic.find(topicQuery), req.query)
        .search()
        .pagination(size);

    allTopics = await apiFeaturesPagination.query;


    const topics = allTopics.map(topic => ({
        _id: topic._id,
        name: topic.name,
        description: topic.description,
        beginAt: topic.beginAt,
        endAt: topic.endAt,
        instructor: topic.instructor,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,

    }))

    res.json({
        success: true,
        topics,
        size: Number(size),
        totals
    })
});

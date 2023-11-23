import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Topic from '../models/topic.js';
import { TopicAPIFeatures } from '../utils/APIFeatures.js';
import handleFormatVietnameseDateTopic from '../utils/dateUtils.js';

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
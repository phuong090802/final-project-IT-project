import express from 'express';
import {
    handleGetAllTopic,
    handleGetTopic,
    handleGetAllTopicByUserId
} from '../controllers/topic.js';


const router = express.Router();

router.route('/users/:id')
    .get(handleGetAllTopicByUserId)

router.route('/:id')
    .get(handleGetTopic)

router.route('/')
    .get(handleGetAllTopic)


export default router;
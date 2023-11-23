import express from 'express';
import {
    handleGetAllTopic,
    handleGetTopic
} from '../controllers/topic.js';


const router = express.Router();

router.route('/:id')
    .get(handleGetTopic)

router.route('/')
    .get(handleGetAllTopic)


export default router;
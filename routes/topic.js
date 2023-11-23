import express from 'express';
import {
    handleGetAllTopic
} from '../controllers/topic.js';


const router = express.Router();


router.route('/')
    .get(handleGetAllTopic)


export default router;
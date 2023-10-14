import express from 'express';
import { handleCreate, handleUpdate, handleDelete } from '../controllers/topicController.js';
import { verifyCreateTopic, verifyUpdateTopic } from '../middlewares/verifyTopic.js';

const router = express.Router();

router.route('/').post(verifyCreateTopic, handleCreate);
router.route('/:id').put(verifyUpdateTopic, handleUpdate).delete(handleDelete);

export default router;
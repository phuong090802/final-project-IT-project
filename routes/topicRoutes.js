import express from 'express';
import { handleCreate, handleUpdate, handleDelete, handleGetAll, handleGet } from '../controllers/topicController.js';
import { verifyCreateTopic, verifyUpdateTopic } from '../middlewares/topicMiddleware.js';
import { verifyToken, roleUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(verifyCreateTopic, handleCreate).get(handleGetAll);
router.route('/:id').put(verifyUpdateTopic, verifyToken, roleUser, handleUpdate).delete(handleDelete).get(handleGet);

export default router;
import express from 'express';
import {
    handleUpdatePassword,
    handleCreateTopic
} from '../controllers/user.js';

import { authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();


router.route('/topics')
    .post(authorizeRoles('user'), handleCreateTopic)

router.route('/')
    .patch(authorizeRoles('admin', 'user'), handleUpdatePassword)


export default router;
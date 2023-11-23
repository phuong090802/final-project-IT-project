import express from 'express';
import {
    handleCreateTopic,
    handleDeleteToplic,
    handleGetAllTopicOfCurrentUser,
    handleGetAllUser,
    handleGetUser,
    handleUpdatePassword,
    handleUpdateTopic,
    handleGetTopic
} from '../controllers/user.js';

import {
    authorizeRoles,
    isAuthenticatedUser
} from '../middlewares/auth.js';

const router = express.Router();

router.route('/:id')
    .get(handleGetUser)

router.route('/topics/:id')
    .get(isAuthenticatedUser, authorizeRoles('user'), handleGetTopic)
    .put(isAuthenticatedUser, authorizeRoles('user'), handleUpdateTopic)
    .delete(isAuthenticatedUser, authorizeRoles('user'), handleDeleteToplic)

router.route('/topics')
    .get(isAuthenticatedUser, authorizeRoles('user'), handleGetAllTopicOfCurrentUser)
    .post(isAuthenticatedUser, authorizeRoles('user'), handleCreateTopic)

router.route('/')
    .get(handleGetAllUser)
    .patch(isAuthenticatedUser, authorizeRoles('admin', 'user'), handleUpdatePassword)


export default router;
import express from 'express';
import { authenticateUser, softAuthenticateUser } from '../utils/middleware/basicAuth';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

// Public endpoints
router.use(softAuthenticateUser);

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

router.get('/files/:id/data', FilesController.getFile);

// Protect endpoints
router.use(authenticateUser);

router.post('/files', FilesController.postUpload);

router.get('/files', FilesController.getIndex);
router.get('/files/:id', FilesController.getShow);

router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

export default router;

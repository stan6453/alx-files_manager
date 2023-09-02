import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);
// router.get('/users/me', UserController.getMe);

// router.get('/connect', AuthController.getConnect);
// router.get('/disconnect', AuthController.getDisconnect);

export default router;

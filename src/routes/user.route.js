// Modules
import { Router } from 'express';
import userController from '../controllers/user.controller.js';

// Middlewares
import { validId, validUser } from '../middlewares/global.middlewares.js';

// Routes
const router = Router();

router.post('/', userController.create);
router.get('/', userController.findAll);
router.get('/:id', validId, validUser, userController.findById);
router.patch('/update/:id', validId, validUser, userController.update);

export default router;
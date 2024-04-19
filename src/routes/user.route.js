// Modules
import { Router } from 'express';
import userController from '../controllers/user.controller.js';

// Middlewares
import { validId, validUser } from '../middlewares/global.middlewares.js';

// Routes
const userRouter = Router();

userRouter.post('/', userController.create);
userRouter.get('/', userController.findAll);
userRouter.get('/:id', validId, validUser, userController.findById);
userRouter.patch('/update/:id', validId, validUser, userController.update);

export default userRouter;
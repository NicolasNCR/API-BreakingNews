// Modules
import { Router } from 'express';
import userController from '../controllers/user.controller.js';

// Middlewares
import { validId, validUser } from '../middlewares/global.middlewares.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

// Routes
const userRouter = Router();

userRouter.post('/', userController.create);
userRouter.use(authMiddleware); // todas rotas abaixo possuirão o authMiddleware
userRouter.get('/', userController.findAll);
userRouter.get('/findById/:id?', validId, validUser, userController.findById);
userRouter.patch('/update/:id', validId, validUser, userController.update);

export default userRouter;  
// Modules
import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

// Routes
const authRouter = Router();

authRouter.post('/', login);

export default authRouter;
// Modules
import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

// Routes
const router = Router();

router.post('/', login);

export default router;
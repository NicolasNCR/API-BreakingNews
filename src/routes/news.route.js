// Modules
import { Router } from "express";
import { create, findAll, findById, topNews, searchByTitle, byUser, updade, erase, likeNews, addComment, deleteComment } from '../controllers/news.controller.js';

// Middleware
import { authMiddleware } from '../middlewares/auth.middleware.js';

// Routes
const router = Router();

router.post('/', authMiddleware, create);
router.get('/', findAll);
router.get('/top', topNews);
router.get('/search', searchByTitle);
router.get('/byuser', authMiddleware, byUser);
// Rota com parâmetro deve ficar por último para evitar bugs caso seja "/parâmetro" e não tenha nada antes do "/" para se diferenciar das demais (Ex: '/teste/:id') 
router.get('/find/:id', authMiddleware, findById);
router.patch('/update/:id', authMiddleware, updade);
router.delete('/delete/:id', authMiddleware, erase);
router.patch('/like/:id', authMiddleware, likeNews);
router.patch('/comment/:id', authMiddleware, addComment);
router.patch('/comment/:idNews/:idComment', authMiddleware, deleteComment);

export default router;
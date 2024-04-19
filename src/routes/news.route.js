// Modules
import { Router } from 'express';
import { create, findAll, findById, topNews, searchByTitle, byUser, updade, erase, likeNews, addComment, deleteComment } from '../controllers/news.controller.js';

// Middleware
import { authMiddleware } from '../middlewares/auth.middleware.js';

// Routes
const newsRouter = Router();

newsRouter.post('/', authMiddleware, create);
newsRouter.get('/', findAll);
newsRouter.get('/top', topNews);
newsRouter.get('/search', searchByTitle);
newsRouter.get('/byuser', authMiddleware, byUser);
// Rota com parâmetro deve ficar por último para evitar bugs caso seja "/parâmetro" e não tenha nada antes do "/" para se diferenciar das demais (Ex: '/teste/:id') 
newsRouter.get('/find/:id', authMiddleware, findById);
newsRouter.patch('/update/:id', authMiddleware, updade);
newsRouter.delete('/delete/:id', authMiddleware, erase);
newsRouter.patch('/like/:id', authMiddleware, likeNews);
newsRouter.patch('/comment/:id', authMiddleware, addComment);
newsRouter.patch('/comment/:idNews/:idComment', authMiddleware, deleteComment);

export default newsRouter;
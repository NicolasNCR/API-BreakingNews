// Modules
import { createService, findAllService, findByIdService, countNews, topNewsService, searchByTitleService, byUserService, updadeService, eraseService, likeNewsService, deleteLikeNewsService, addCommentService, deleteCommentService } from '../services/news.service.js'

export const create = async (req, res) => {
    try {
        const {title, text, banner} = req.body;

        if (!title || !text || !banner) {
            res.status(400).send({ message: "Submit all fields for registration" });
        }

        await createService({
            title,
            text,
            banner,
            user: req.userId
        });

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }   
};

export const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 5;
        }

        if (!offset) {
            offset = 0;
        }

        const news = await findAllService(offset, limit);
        const total = await countNews();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        // IF Ternário: valores diferentes a uma variável de acordo com uma determinada condição.
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if (news.length === 0){
            return res.send(400).send({ message: "There are no registered news" });
        }

        news.shift(); // desconsidera a última notícia adicionada (ela será utilizada na rota de top news)

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map(item => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                userName: item.user.username,
                userAvatar: item.user.avatar,
            }))
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res.status(400).send({ message: "There is no registered news" });
        }

        res.send({news: {
            id: news._id,
            title: news.title,
            text: news.text,
            banner: news.banner,
            likes: news.likes,
            comments: news.comments,
            name: news.user.name,
            userName: news.user.username,
            userAvatar: news.user.avatar,
        }});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        res.send({news: {
            id: news._id,
            title: news.title,
            text: news.text,
            banner: news.banner,
            likes: news.likes,
            comments: news.comments,
            name: news.user.name,
            userName: news.user.username,
            userAvatar: news.user.avatar,
        }});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await searchByTitleService(title);

        if (news.length === 0) {
            return res.status(400).send({ message: "There are no news with this title" });
        }

        res.send({results: news.map(item => ({
            id: item._id,
            title: item.title,
            text: item.text,
            banner: item.banner,
            likes: item.likes,
            comments: item.comments,
            name: item.user.name,
            userName: item.user.username,
            userAvatar: item.user.avatar,
        }))});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const news = await byUserService(id);

        res.send({results: news.map(item => ({
            id: item._id,
            title: item.title,
            text: item.text,
            banner: item.banner,
            likes: item.likes,
            comments: item.comments,
            name: item.user.name,
            userName: item.user.username,
            userAvatar: item.user.avatar,
        }))});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const updade = async (req, res) => {
    try {
        const { title, text, banner } = req.body;
        const { id } = req.params;

        if (!title && !text && !banner) {
            res.status(400).send({ message: "Submit at least one field to update the news" });
        }

        const news = await findByIdService(id);

        if (news.user._id != req.userId) {
            return res.status(400).send({ message: "You can't update this news" });
        }

        await updadeService(id, title, text, banner);

        return res.send({ message: "News successfuly updated" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const erase = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        if (news.user._id != req.userId) {
            return res.status(400).send({ message: "You can't delete this news" });
        }

        await eraseService(id);

        return res.send({ message: "News successfuly deleted" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const likeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const newsLiked = await likeNewsService(id, userId);

        if (!newsLiked) {
            await deleteLikeNewsService(id, userId);
            return res.status(200).send({ message: "Like successfuly removed" });
        }

        res.send({ message: "Like done successfuly" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { comment } =  req.body;

        if (!comment) {
            return res.status(400).send({ message: "Write a message to comment" });
        }

        await addCommentService(id, comment, userId);

        res.send({ message: "Comment successfuly completed" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { idNews, idComment } = req.params;
        const userId = req.userId;

        const commentDeletec = await deleteCommentService(idNews, idComment, userId);

        const commentFinder = commentDeletec.comments.find((comment) => comment.idComment === idComment);

        if (!commentFinder) {
            return res.status(404).send({ message: "Comment not found" });
        }
 
        if (commentFinder.userId != userId) {
            return res.status(400).send({ message: "You can't delete this comment" });
        }

        res.send({ message: "Comment successfuly removed" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
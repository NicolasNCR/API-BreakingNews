// Modules
import News from '../models/News.js';

export const createService = (body) => News.create(body);

// Traduzindo: será realizado um findAll nas notícias registradas, fazendo com que elas apareçam da mais recente para a mais antiga. O "skip" mostra a partir de onde que a listagem irá começar (por padrão é na posição 0). E o "limit" mostra a quantidade de notícias que será buscada por vez (por padrão é 5). O "populate" é utilizado para preencher o campo com o ID do user com o restante das infromações do mesmo (como name, username, email...)
export const findAllService = (offset, limit) => News.find().sort({_id: -1}).skip(offset).limit(limit).populate("user");

export const findByIdService = (id) => News.findById(id).populate("user");

export const countNews = () => News.countDocuments();

export const topNewsService = () => News.findOne().sort({_id: -1}).populate("user");

// "$regex" é usado para correspondência de padrões, que é basicamente para encontrar strings em documentos. O $options: "i" é para não diferenciar letras maiúsculas de minúsculas.
export const searchByTitleService = (title) => News.find({
    title: {$regex: `${title || ""}`, $options: "i"}
}).sort({_id: -1}).populate("user");

export const byUserService = (id) => News.find({user: id}).sort({_id: -1}).populate("user");

// O primeirop parâmetro do findOneAndUpdate é o que eu quero encontrar e os outros fazem referência ao que eu quero mudar.
export const updadeService = (id, title, text, banner) => News.findOneAndUpdate({_id: id}, {title, text, banner}, {rawResult: true});

export const eraseService = (id) => News.findOneAndDelete({_id: id});

// A segunda parte do filtro localiza se tem algum userId registrado em likes, se for repetido, então o like não funciona (realizado pelo "$nin", que significa "not in"). O push serve para atruibuir dados.
export const likeNewsService = (id, userId) => News.findOneAndUpdate({_id: id, "likes.userId" : {$nin: [userId]}}, {$push: {likes: {userId, created: new Date()}}});

// O pull serve para retirar dados.
export const deleteLikeNewsService = (id, userId) => News.findOneAndUpdate({_id: id}, {$pull: {likes: {userId}}});

export const addCommentService = (id, comment, userId) => {
    const idComment = Math.floor(Date.now() * Math.random()).toString(36);

    return News.findOneAndUpdate({_id: id}, {$push: {comments: {idComment, userId, comment, created: new Date()}}});
};

export const deleteCommentService = (idNews, idComment, userId) => News.findOneAndUpdate({_id: idNews}, {$pull: {comments: { idComment, userId }}});
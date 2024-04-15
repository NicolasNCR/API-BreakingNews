// Modules
import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './database/db.js';

// Settings
dotenv.config()

// Routes
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import newsRoute from './routes/news.route.js';
import swaggerRoute from './routes/swagger.route.js';

const app = express();

connectDatabase();
app.use(express.json());
app.use('/user', userRoute);
app.use('/auth', authRoute);
app.use('/news', newsRoute);
app.use('/doc', swaggerRoute);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}...`));
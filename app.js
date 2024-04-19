// Modules
import express from 'express';
import 'dotenv/config';
import connectDatabase from './src/database/db.js';
import router from './src/routes/index.js';

const app = express();

connectDatabase();
app.use(express.json());
app.use(router);

export default app;
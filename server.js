// Modules
import 'dotenv/config';
import app from './app.js';

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}...`));
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { sessionMiddleware } from './middlewares/sessionMiddleware.js';
import sessionRoutes from './routes/sessionRoutes.js';
import iaRoutes from './routes/iaRoutes.js';

const app = express();

// Middlewares
app.use(cors({
    origin: true, 
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'patofu',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Middleware de sessão personalizado
app.use(sessionMiddleware);

// Routes
app.use('/api/session', sessionRoutes);
app.use('/api/ia', iaRoutes);

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
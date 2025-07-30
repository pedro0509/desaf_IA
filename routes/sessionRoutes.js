import { Router } from 'express';
import sessionController from '../controllers/sessionController.js';

const router = Router();

// Criar nova sessão
router.post('/create-session', sessionController.criarSessao);

// Obter dados da sessão
router.get('/game-session', sessionController.obterSessao);

export default router;
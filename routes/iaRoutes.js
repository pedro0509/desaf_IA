import { Router } from 'express';
import iaController from '../controllers/iaController.js';

const router = Router();

// Enviar pergunta para IA
router.post('/ask', iaController.enviarPergunta);

// Obter histórico de conversas (geral ou por grupo)
router.get('/history', iaController.obterHistorico);

export default router;
import { Router } from 'express';
import iaController from '../controllers/iaController.js';

const router = Router();

// Enviar pergunta para IA
router.post('/ask', iaController.enviarPergunta);

export default router;
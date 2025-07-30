import sessionService from '../services/sessionService.js';

class SessionController {
    /**
     * Criar nova sessão de jogo
     */
    async criarSessao(req, res) {
        try {
            const { courseName, quizTheme, questionCount, teamCount } = req.body;

            // Validação
            if (!courseName || !quizTheme || !questionCount || !teamCount) {
                return res.status(400).json({
                    error: 'Todos os campos são obrigatórios',
                    required: ['courseName', 'quizTheme', 'questionCount', 'teamCount']
                });
            }

            // Criar sessão
            const dadosJogo = { courseName, quizTheme, questionCount, teamCount };
            const sessao = sessionService.criarSessao(req, dadosJogo);

            res.status(201).json(sessao);

        } catch (error) {
            console.error('Erro ao criar sessão:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                message: error.message
            });
        }
    }

    /**
     * Obter dados da sessão atual
     */
    async obterSessao(req, res) {
        try {
            const dadosSessao = sessionService.obterDadosSessao(req);

            res.json({
                sessionId: dadosSessao.sessionId,
                gameData: dadosSessao.gameData
            });

        } catch (error) {
            console.error('Erro ao obter sessão:', error);

            const statusCode = error.message.includes('expirada') ? 401 : 404;
            res.status(statusCode).json({
                error: error.message,
                requiresNewSession: statusCode === 401
            });
        }
    }
}

export default new SessionController();
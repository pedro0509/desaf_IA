import azureOpenAIService from '../services/azureOpenAIService.js';
import sessionService from '../services/sessionService.js';

class IAController {
    /**
     * Enviar pergunta para a IA
     */
    async enviarPergunta(req, res) {
        try {
            const { pergunta, contexto } = req.body;

            // Validação
            if (!pergunta) {
                return res.status(400).json({
                    error: 'Pergunta é obrigatória'
                });
            }

            // Validar sessão
            const sessao = sessionService.validarSessao(req);
            const historicoAnterior = sessao.gameData.historico || [];

            // Enviar pergunta para IA
            const resultado = await azureOpenAIService.enviarPergunta(
                pergunta,
                contexto || `Contexto do curso: ${sessao.gameData.courseName}, Tema: ${sessao.gameData.quizTheme}`,
                historicoAnterior
            );

            // Atualizar histórico na sessão
            sessionService.atualizarHistorico(req, resultado.historicoAtualizado);

            res.json({
                message: 'Pergunta processada com sucesso',
                pergunta,
                resposta: resultado.resposta,
                tokens_utilizados: resultado.tokens_utilizados,
                sessionId: sessao.userId
            });

        } catch (error) {
            console.error('Erro ao processar pergunta:', error);
            res.status(500).json({
                error: 'Erro ao processar pergunta',
                message: error.message
            });
        }
    }

    /**
     * Gerar perguntas de quiz
     */
    async gerarPerguntas(req, res) {
        try {
            // Validar sessão
            const sessao = sessionService.validarSessao(req);
            const { courseName, quizTheme, questionCount } = sessao.gameData;

            // Gerar perguntas
            const perguntas = await azureOpenAIService.gerarPerguntas(
                quizTheme,
                questionCount,
                courseName
            );

            // Salvar perguntas na sessão
            sessao.gameData.questions = perguntas;

            res.json({
                message: 'Perguntas geradas com sucesso',
                questions: perguntas,
                total: perguntas.length,
                sessionId: sessao.userId
            });

        } catch (error) {
            console.error('Erro ao gerar perguntas:', error);
            res.status(500).json({
                error: 'Erro ao gerar perguntas',
                message: error.message
            });
        }
    }

    /**
     * Obter histórico de conversas
     */
    async obterHistorico(req, res) {
        try {
            const sessao = sessionService.validarSessao(req);
            const historico = sessao.gameData.historico || [];

            res.json({
                message: 'Histórico obtido com sucesso',
                historico,
                total_mensagens: historico.length,
                sessionId: sessao.userId
            });

        } catch (error) {
            console.error('Erro ao obter histórico:', error);
            res.status(404).json({
                error: 'Erro ao obter histórico',
                message: error.message
            });
        }
    }
}

export default new IAController();
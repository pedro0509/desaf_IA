import azureOpenAIService from '../services/azureOpenAIService.js';
import sessionService from '../services/sessionService.js';

class IAController {
    /**
     * Enviar pergunta para a IA
     */
    async enviarPergunta(req, res) {
        try {
            const { pergunta, quizConfig, grupoId } = req.body;

            // Validação
            if (!pergunta) {
                return res.status(400).json({
                    error: 'Pergunta é obrigatória'
                });
            }

            if (!grupoId || isNaN(grupoId) || grupoId < 1) {
                return res.status(400).json({
                    error: 'ID do grupo é obrigatório e deve ser um número válido'
                });
            }

            // Validar sessão
            const sessao = sessionService.validarSessao(req);
            
            // Verificar se o grupo existe
            if (grupoId > sessao.gameData.teamCount) {
                return res.status(400).json({
                    error: `Grupo ${grupoId} não existe. Máximo de grupos: ${sessao.gameData.teamCount}`
                });
            }

            // Obter histórico específico do grupo
            const historicoGrupo = sessionService.obterHistoricoPorGrupo(req, grupoId);

            // Enviar pergunta para IA
            const resultado = await azureOpenAIService.enviarPergunta(
                pergunta,
                sessao.gameData.courseName || '',
                sessao.gameData.quizTheme || '',
                historicoGrupo
            );

            // Atualizar histórico específico do grupo
            sessionService.atualizarHistoricoPorGrupo(req, grupoId, resultado.historicoAtualizado);

            res.json({
                message: 'Pergunta processada com sucesso',
                pergunta,
                resposta: resultado.resposta,
                tokens_utilizados: resultado.tokens_utilizados,
                sessionId: sessao.userId,
                grupoId: grupoId,
                totalMensagensGrupo: resultado.historicoAtualizado.length
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
     * Obter histórico de conversas
     */
    async obterHistorico(req, res) {
        try {
            const { grupoId } = req.query;
            const sessao = sessionService.validarSessao(req);

            let historico, totalMensagens, responseData;

            if (grupoId && !isNaN(grupoId) && grupoId > 0) {
                // Histórico específico de um grupo
                if (grupoId > sessao.gameData.teamCount) {
                    return res.status(400).json({
                        error: `Grupo ${grupoId} não existe. Máximo de grupos: ${sessao.gameData.teamCount}`
                    });
                }

                historico = sessionService.obterHistoricoPorGrupo(req, parseInt(grupoId));
                totalMensagens = historico.length;

                responseData = {
                    message: `Histórico do Grupo ${grupoId} obtido com sucesso`,
                    grupoId: parseInt(grupoId),
                    historico,
                    total_mensagens: totalMensagens,
                    sessionId: sessao.userId
                };
            } else {
                // Histórico de todos os grupos
                const todoHistorico = sessionService.obterTodoHistoricoPorGrupo(req);
                let totalMensagensGeral = 0;

                // Calcular total de mensagens
                Object.values(todoHistorico).forEach(hist => {
                    totalMensagensGeral += hist.length;
                });

                responseData = {
                    message: 'Histórico completo obtido com sucesso',
                    historicoPorGrupo: todoHistorico,
                    total_grupos: sessao.gameData.teamCount,
                    total_mensagens_geral: totalMensagensGeral,
                    sessionId: sessao.userId,
                    // Manter compatibilidade com histórico geral
                    historico: sessao.gameData.historico || [],
                    total_mensagens: (sessao.gameData.historico || []).length
                };
            }

            res.json(responseData);

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
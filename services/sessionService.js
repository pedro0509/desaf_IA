import { v4 as uuidv4 } from 'uuid';

class SessionService {
    /**
     * Criar nova sessão com dados do jogo
     */
    criarSessao(req, dadosJogo) {

        if (!dadosJogo || !dadosJogo.courseName || !dadosJogo.quizTheme || !dadosJogo.questionCount || !dadosJogo.teamCount) {
            throw new Error('Dados do jogo inválidos');
        }

        const { courseName, quizTheme, questionCount, teamCount } = dadosJogo;

        // Criar userId se não existir
        if (!req.session.userId) {
            req.session.userId = uuidv4();
            req.session.createdAt = new Date();
        }

        // Criar histórico separado para cada grupo
        const historicoPorGrupo = {};
        for (let i = 1; i <= parseInt(teamCount); i++) {
            historicoPorGrupo[i] = [];
        }

        req.session.gameData = {
            courseName,
            quizTheme,
            questionCount: parseInt(questionCount),
            teamCount: parseInt(teamCount),
            createdAt: new Date(),
            status: 'created',
            historico: [], // Mantido para compatibilidade
            historicoPorGrupo: historicoPorGrupo
        };

        return {
            sessionId: req.session.userId,
            gameData: req.session.gameData
        };
    }

    /**
     * Validar sessão existente
     */
    validarSessao(req) {
        if (!req.session || !req.session.userId) {
            throw new Error('Sessão inválida ou expirada');
        }

        if (!req.session.gameData) {
            throw new Error('Nenhum jogo encontrado na sessão');
        }

        // Verificar expiração (24 horas)
        const sessionAge = new Date() - new Date(req.session.createdAt);
        const maxAge = 24 * 60 * 60 * 1000;

        if (sessionAge > maxAge) {
            req.session.destroy();
            throw new Error('Sessão expirada');
        }

        return req.session;
    }

    /**
     * Obter dados da sessão
     */
    obterDadosSessao(req) {
        const sessao = this.validarSessao(req);
        return {
            sessionId: sessao.userId,
            gameData: sessao.gameData,
            createdAt: sessao.createdAt
        };
    }

    /**
     * Atualizar histórico de conversa na sessão
     */
    atualizarHistorico(req, novoHistorico) {
        if (!req.session.gameData) {
            throw new Error('Sessão inválida');
        }

        req.session.gameData.historico = novoHistorico;
        return req.session.gameData;
    }

    /**
     * Atualizar histórico de conversa para um grupo específico
     * @param {Object} req - Request object
     * @param {number} grupoId - ID do grupo (1, 2, 3, etc.)
     * @param {Array} novoHistorico - Novo histórico do grupo
     */
    atualizarHistoricoPorGrupo(req, grupoId, novoHistorico) {
        if (!req.session.gameData) {
            throw new Error('Sessão inválida');
        }

        if (!req.session.gameData.historicoPorGrupo) {
            // Inicializar histórico por grupo se não existir (compatibilidade)
            req.session.gameData.historicoPorGrupo = {};
            for (let i = 1; i <= req.session.gameData.teamCount; i++) {
                req.session.gameData.historicoPorGrupo[i] = [];
            }
        }

        req.session.gameData.historicoPorGrupo[grupoId] = novoHistorico;
        return req.session.gameData;
    }

    /**
     * Obter histórico de conversa para um grupo específico
     * @param {Object} req - Request object
     * @param {number} grupoId - ID do grupo (1, 2, 3, etc.)
     * @returns {Array} Histórico do grupo
     */
    obterHistoricoPorGrupo(req, grupoId) {
        if (!req.session.gameData) {
            throw new Error('Sessão inválida');
        }

        if (!req.session.gameData.historicoPorGrupo) {
            // Inicializar histórico por grupo se não existir (compatibilidade)
            req.session.gameData.historicoPorGrupo = {};
            for (let i = 1; i <= req.session.gameData.teamCount; i++) {
                req.session.gameData.historicoPorGrupo[i] = [];
            }
        }

        return req.session.gameData.historicoPorGrupo[grupoId] || [];
    }

    /**
     * Obter histórico completo de todos os grupos
     * @param {Object} req - Request object
     * @returns {Object} Histórico de todos os grupos
     */
    obterTodoHistoricoPorGrupo(req) {
        if (!req.session.gameData) {
            throw new Error('Sessão inválida');
        }

        if (!req.session.gameData.historicoPorGrupo) {
            // Inicializar histórico por grupo se não existir (compatibilidade)
            req.session.gameData.historicoPorGrupo = {};
            for (let i = 1; i <= req.session.gameData.teamCount; i++) {
                req.session.gameData.historicoPorGrupo[i] = [];
            }
        }

        return req.session.gameData.historicoPorGrupo;
    }
}

export default new SessionService();
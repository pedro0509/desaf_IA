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

        req.session.gameData = {
            courseName,
            quizTheme,
            questionCount: parseInt(questionCount),
            teamCount: parseInt(teamCount),
            createdAt: new Date(),
            status: 'created',
            historico: []
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
}

export default new SessionService();
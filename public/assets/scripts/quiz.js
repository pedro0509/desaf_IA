// ==========================================
// QUIZ.JS - Sistema de Quiz Interativo
// ==========================================

// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================
let quizConfig = null;
let currentTeam = 1;
let totalTeams = 4;
let questionsPerTeam = 3;
let currentQuestionForTeam = 1;
let totalQuestions = 0;
let currentQuestionOverall = 1;
let teamsProgress = {};
let questionsCompleted = 0;

// Elementos DOM
let btnEnviarPergunta, caixaPergunta, respostaIA, textoResposta;

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Função principal de inicialização
function initQuiz() {
    console.log('Inicializando Quiz...');

    // Aguardar o DOM carregar completamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupQuiz);
    } else {
        setupQuiz();
    }
}

// Configurar o quiz após DOM carregado
async function setupQuiz() {
    try {
        // Inicializar elementos DOM
        initializeElements();

        // Carregar dados da sessão
        await loadGameSession();

        // Inicializar progresso dos grupos
        initializeTeamsProgress();

        // Configurar interface
        updateAllDisplays();
        generateGroupIndicators();

        // Configurar event listeners
        setupEventListeners();

        console.log('Quiz inicializado com sucesso!');

    } catch (error) {
        console.error('Erro ao inicializar quiz:', error);
        showAlert(error.message, 'danger');
    }
}

// Inicializar elementos DOM
function initializeElements() {
    btnEnviarPergunta = document.getElementById('btnEnviarPergunta');
    caixaPergunta = document.getElementById('caixaPergunta');
    respostaIA = document.getElementById('respostaIA');
    textoResposta = document.getElementById('textoResposta');

    if (!btnEnviarPergunta || !caixaPergunta || !respostaIA || !textoResposta) {
        throw new Error('Elementos DOM essenciais não encontrados');
    }
}

// Configurar event listeners
function setupEventListeners() {
    btnEnviarPergunta.addEventListener('click', handleSendQuestion);

    // Enter + Ctrl na textarea para enviar pergunta
    caixaPergunta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSendQuestion();
        }
    });
}

// ==========================================
// GERENCIAMENTO DE PERGUNTAS
// ==========================================

// Processar envio de pergunta
async function handleSendQuestion() {
    const pergunta = caixaPergunta.value.trim();

    if (!pergunta) {
        showAlert('Por favor, digite uma pergunta', 'warning');
        caixaPergunta.focus();
        return;
    }

    try {

        blockCardQuestion();

        // Esconder resposta anterior
        respostaIA.style.display = 'block';
        respostaIA.classList.remove('show');
        respostaIA.classList.add('loading');

        textoResposta.textContent = '';

        // Enviar pergunta para IA
        const resposta = await enviarPerguntaIA(pergunta);

        // Mostrar resposta
        textoResposta.textContent = resposta;
        respostaIA.style.display = 'block';

        // Mostrar resposta
        textoResposta.textContent = resposta;
        respostaIA.classList.remove('loading');
        respostaIA.classList.add('show');

        // Atualizar progresso
        updateQuestionProgress();

    } catch (error) {
        console.error('Erro ao processar pergunta:', error);
        showAlert('Erro: ' + error.message, 'danger');

        hideResponseCard();
    }
}
// ==========================================
// GERENCIAMENTO DE GRUPOS E PROGRESSO
// ==========================================

function initializeTeamsProgress() {
    for (let i = 1; i <= totalTeams; i++) {
        teamsProgress[i] = 0;
    }
}

function updateQuestionProgress() {
    // Incrementar pergunta atual do grupo
    teamsProgress[currentTeam]++;
    questionsCompleted++;
    currentQuestionOverall++;

    updateAllDisplays();
    generateGroupIndicators();
}

function updateAllDisplays() {
    // Atualizar displays do header
    const currentQuestionEl = document.getElementById('currentQuestion');
    const totalQuestionsEl = document.getElementById('totalQuestions');

    if (currentQuestionEl) currentQuestionEl.textContent = currentQuestionOverall;
    if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions;

    // Atualizar displays do card
    const teamNumberEl = document.getElementById('teamNumber');
    const currentTeamDisplayEl = document.getElementById('currentTeamDisplay');
    const totalTeamsDisplayEl = document.getElementById('totalTeamsDisplay');
    const currentQuestionForTeamEl = document.getElementById('currentQuestionForTeam');
    const questionsPerTeamEl = document.getElementById('questionsPerTeam');

    if (teamNumberEl) teamNumberEl.textContent = `Grupo ${currentTeam}`;
    if (currentTeamDisplayEl) currentTeamDisplayEl.textContent = currentTeam;
    if (totalTeamsDisplayEl) totalTeamsDisplayEl.textContent = totalTeams;
    if (currentQuestionForTeamEl) currentQuestionForTeamEl.textContent = (teamsProgress[currentTeam] || 0) + 1;
    if (questionsPerTeamEl) questionsPerTeamEl.textContent = questionsPerTeam;

    // Atualizar displays do progresso
    const progressCurrentTeamEl = document.getElementById('progressCurrentTeam');
    const progressCurrentQuestionEl = document.getElementById('progressCurrentQuestion');
    const progressTotalQuestionsEl = document.getElementById('progressTotalQuestions');
    const questionsCompletedEl = document.getElementById('questionsCompleted');
    const totalQuestionsOverallEl = document.getElementById('totalQuestionsOverall');

    if (progressCurrentTeamEl) progressCurrentTeamEl.textContent = currentTeam;
    if (progressCurrentQuestionEl) progressCurrentQuestionEl.textContent = (teamsProgress[currentTeam] || 0) + 1;
    if (progressTotalQuestionsEl) progressTotalQuestionsEl.textContent = questionsPerTeam;
    if (questionsCompletedEl) questionsCompletedEl.textContent = questionsCompleted;
    if (totalQuestionsOverallEl) totalQuestionsOverallEl.textContent = totalQuestions;
}

// Gerar indicadores visuais dos grupos
function generateGroupIndicators() {
    const container = document.getElementById('groupIndicators');
    if (!container) return;

    container.innerHTML = '';

    for (let i = 1; i <= totalTeams; i++) {
        const indicator = document.createElement('div');
        const questionsForThisTeam = teamsProgress[i] || 0;
        const isCurrentTeam = i === currentTeam;
        const isCompleted = questionsForThisTeam >= questionsPerTeam;

        indicator.className = 'group-indicator';
        indicator.innerHTML = `
            <div class="text-center">
                <div class="indicator-circle">G${i}</div>
                <small>${questionsForThisTeam}/${questionsPerTeam}</small>
            </div>
        `;

        // Estilos baseados no status
        let backgroundColor, textColor, borderColor;
        if (isCompleted) {
            backgroundColor = '#198754'; // success green
            textColor = 'white';
            borderColor = '#198754';
        } else if (isCurrentTeam) {
            backgroundColor = '#0d6efd'; // primary blue
            textColor = 'white';
            borderColor = '#0d6efd';
        } else {
            backgroundColor = '#e9ecef'; // light gray
            textColor = '#6c757d';
            borderColor = '#dee2e6';
        }

        indicator.style.cssText = `
            margin: 0 2px;
            transition: all 0.3s ease;
        `;

        const circle = indicator.querySelector('.indicator-circle');
        circle.style.cssText = `
            width: 35px; height: 35px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: bold; font-size: 0.8rem;
            background-color: ${backgroundColor};
            color: ${textColor};
            border: 2px solid ${borderColor};
            margin-bottom: 2px;
        `;

        container.appendChild(indicator);
    }
}

// Avançar para próximo grupo
function nextTeam() {
    // Verificar se o grupo atual completou todas as perguntas
    if ((teamsProgress[currentTeam] || 0) < questionsPerTeam) {
        const remaining = questionsPerTeam - (teamsProgress[currentTeam] || 0);
        showAlert(`O Grupo ${currentTeam} ainda tem ${remaining} pergunta(s) restante(s)!`, 'warning');
    }

    // Verificar se todos os grupos completaram
    if (questionsCompleted >= totalQuestions) {
        showAlert('🎉 Parabéns! Todos os grupos completaram todas as perguntas!', 'success');

        setTimeout(() => {
            window.location.href = 'resultados.html';
        }, 3000);

        return;
    }

    // Próximo grupo
    currentTeam = currentTeam >= totalTeams ? 1 : currentTeam + 1;

    // Se o próximo grupo já completou todas as perguntas, continuar procurando
    while ((teamsProgress[currentTeam] || 0) >= questionsPerTeam && questionsCompleted < totalQuestions) {
        currentTeam = currentTeam >= totalTeams ? 1 : currentTeam + 1;

        // Verificação de segurança para evitar loop infinito
        let allCompleted = true;
        for (let i = 1; i <= totalTeams; i++) {
            if ((teamsProgress[i] || 0) < questionsPerTeam) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            showAlert('🎉 Parabéns! Todos os grupos completaram todas as perguntas!', 'success');
            setTimeout(() => {
                window.location.href = 'resultados.html';
            }, 3000);
            return;
        }
    }

    desBlockCardQuestion();

    // Limpar interface
    caixaPergunta.value = '';
    hideResponseCard();

    updateAllDisplays();
    generateGroupIndicators();

    // Scroll para o topo e focar na textarea
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        caixaPergunta.focus();
    }, 500);
}

// ==========================================
// UTILITÁRIOS DE UI
// ==========================================

// Controlar estado de loading
function setLoadingState(loading) {
    const btnText = document.getElementById('btnText');
    const icon = btnEnviarPergunta.querySelector('i');

    if (loading) {
        btnEnviarPergunta.disabled = true;
        if (btnText) btnText.textContent = 'Processando...';
        if (icon) icon.className = 'bi bi-hourglass-split me-2';
        caixaPergunta.disabled = true;
    } else {
        desBlockCardQuestion();
    }
}

function blockCardQuestion() {
    const btnText = document.getElementById('btnText');
    const icon = btnEnviarPergunta.querySelector('i');

    btnEnviarPergunta.disabled = true;
    if (btnText) btnText.textContent = 'Respondido!';
    if (icon) icon.className = 'bi bi-hourglass-split me-2';
    caixaPergunta.disabled = true;
}

function desBlockCardQuestion() {
    const btnText = document.getElementById('btnText');
    const icon = btnEnviarPergunta.querySelector('i');

    btnEnviarPergunta.disabled = false;
    if (btnText) btnText.textContent = 'Enviar Pergunta';
    if (icon) icon.className = 'bi bi-send me-2';
    caixaPergunta.disabled = false;
}

// Função auxiliar para esconder o card de resposta
function hideResponseCard() {
    if (respostaIA) {
        respostaIA.classList.remove('show', 'loading');
        setTimeout(() => {
            respostaIA.style.display = 'none';
        }, 300);
    }
}

// Mostrar alertas/notificações
function showAlert(message, type = 'info') {
    // Criar toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);

    // Auto remove após 5 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Limpar pergunta
function clearQuestion() {
    if (caixaPergunta) {
        caixaPergunta.value = '';
        caixaPergunta.focus();
    }
}

// Voltar ao início
function goHome() {
    window.location.href = 'index.html';
}

// ==========================================
// CARREGAMENTO DE DADOS
// ==========================================

// Carregar dados da sessão do jogo
async function loadGameSession() {
    try {
        const gameSessionId = localStorage.getItem('gameSessionId');
        const gameCreated = localStorage.getItem('gameCreated');

        if (!gameSessionId || !gameCreated) {
            throw new Error('Nenhum jogo encontrado. Redirecionando para página inicial...');
        }

        const response = await fetch('/api/session/game-session', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const sessionData = await response.json();
            quizConfig = sessionData.gameData;

            // Configurar variáveis do jogo
            totalTeams = sessionData.gameData.teamCount || 1;
            questionsPerTeam = sessionData.gameData.questionCount || 1;
            totalQuestions = totalTeams * questionsPerTeam;

            displayGameInfo(sessionData.gameData);
            console.log('Dados da sessão carregados:', {
                totalTeams,
                questionsPerTeam,
                totalQuestions,
                gameData: sessionData.gameData
            });
        } else {
            const error = await response.json();
            throw new Error('Erro ao carregar dados do jogo');
        }

    } catch (error) {
        console.error('Erro:', error);
        throw new Error(error.message || 'Erro ao conectar com o servidor');
    }
}

// Exibir informações do jogo
function displayGameInfo(gameData) {
    const elements = {
        quizTheme: document.getElementById('quizTheme'),
        courseName: document.getElementById('courseName')
    };

    if (elements.quizTheme && gameData.quizTheme) {
        elements.quizTheme.textContent = gameData.quizTheme;
    }

    if (elements.courseName && gameData.courseName) {
        elements.courseName.textContent = gameData.courseName;
    }
}

// ==========================================
// COMUNICAÇÃO COM IA
// ==========================================

// Enviar pergunta para IA
async function enviarPerguntaIA(pergunta) {
    try {
        const response = await fetch('/api/ia/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                pergunta: pergunta,
                quizConfig: quizConfig,
                grupoId: currentTeam // Enviar ID do grupo atual
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao processar pergunta');
        }

        const data = await response.json();
        console.log(`Pergunta enviada pelo Grupo ${currentTeam}:`, pergunta);
        console.log(`Resposta da IA para Grupo ${currentTeam}:`, data.resposta);
        console.log(`Total de mensagens do Grupo ${currentTeam}:`, data.totalMensagensGrupo);
        
        return data.resposta;

    } catch (error) {
        console.error('Erro ao enviar pergunta:', error);
        throw new Error(error.message || 'Erro de comunicação com o servidor');
    }
}

// Obter histórico de um grupo específico
async function obterHistoricoGrupo(grupoId) {
    try {
        const response = await fetch(`/api/ia/history?grupoId=${grupoId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao obter histórico');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`Erro ao obter histórico do grupo ${grupoId}:`, error);
        throw new Error(error.message || 'Erro de comunicação com o servidor');
    }
}

// Obter histórico completo de todos os grupos
async function obterHistoricoCompleto() {
    try {
        const response = await fetch('/api/ia/history', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao obter histórico completo');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Erro ao obter histórico completo:', error);
        throw new Error(error.message || 'Erro de comunicação com o servidor');
    }
}

// Mostrar histórico de um grupo específico (para debugging)
async function mostrarHistoricoGrupo(grupoId) {
    try {
        const historico = await obterHistoricoGrupo(grupoId);
        console.log(`=== Histórico do Grupo ${grupoId} ===`);
        console.log(`Total de mensagens: ${historico.total_mensagens}`);
        console.log('Mensagens:', historico.historico);
        return historico;
    } catch (error) {
        console.error(`Erro ao mostrar histórico do grupo ${grupoId}:`, error);
    }
}

// Mostrar histórico completo de todos os grupos (para debugging)
async function mostrarHistoricoCompleto() {
    try {
        const historico = await obterHistoricoCompleto();
        console.log('=== Histórico Completo de Todos os Grupos ===');
        console.log(`Total de grupos: ${historico.total_grupos}`);
        console.log(`Total de mensagens gerais: ${historico.total_mensagens_geral}`);
        
        Object.entries(historico.historicoPorGrupo).forEach(([grupoId, hist]) => {
            console.log(`Grupo ${grupoId}: ${hist.length} mensagens`);
        });
        
        console.log('Histórico por grupo:', historico.historicoPorGrupo);
        return historico;
    } catch (error) {
        console.error('Erro ao mostrar histórico completo:', error);
    }
}

// ==========================================
// FUNÇÕES EXPOSTAS GLOBALMENTE
// ==========================================

// Tornar funções disponíveis globalmente para uso no HTML
window.initQuiz = initQuiz;
window.nextTeam = nextTeam;
window.clearQuestion = clearQuestion;
window.goHome = goHome;

// Funções para debugging e análise de histórico
window.mostrarHistoricoGrupo = mostrarHistoricoGrupo;
window.mostrarHistoricoCompleto = mostrarHistoricoCompleto;
window.obterHistoricoGrupo = obterHistoricoGrupo;
window.obterHistoricoCompleto = obterHistoricoCompleto;

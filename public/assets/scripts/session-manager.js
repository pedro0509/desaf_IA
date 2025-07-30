// Configuração da API
const API_BASE_URL = 'http://localhost:3000';

// Função para fazer requisições com tratamento de erro
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(API_BASE_URL + url, {
            credentials: 'include', // Importante para incluir cookies de sessão
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Função para exibir mensagens na interface
function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="${isError ? 'error' : 'success'}">${message}</div>`;
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        element.innerHTML = '';
    }, 5000);
}

// Carregar informações da sessão
async function loadSessionInfo() {
    try {
        const sessionData = await makeRequest('/session');
        
        const sessionInfoDiv = document.getElementById('sessionInfo');
        sessionInfoDiv.innerHTML = `
            <h3>Sua Sessão Anônima</h3>
            <p><strong>ID da Sessão:</strong> ${sessionData.sessionId}</p>
            <p><strong>Criada em:</strong> ${new Date(sessionData.createdAt).toLocaleString('pt-BR')}</p>
            <p><strong>Dados armazenados:</strong> ${Object.keys(sessionData.data || {}).length} item(s)</p>
        `;
    } catch (error) {
        showMessage('sessionInfo', `Erro ao carregar sessão: ${error.message}`, true);
    }
}

// Salvar dados na sessão
async function saveData() {
    const key = document.getElementById('dataKey').value.trim();
    const valueText = document.getElementById('dataValue').value.trim();
    
    if (!key) {
        showMessage('saveResult', 'Por favor, informe uma chave', true);
        return;
    }
    
    if (!valueText) {
        showMessage('saveResult', 'Por favor, informe um valor', true);
        return;
    }
    
    // Tentar fazer parse do JSON, se falhar, usar como string
    let value;
    try {
        value = JSON.parse(valueText);
    } catch (e) {
        value = valueText;
    }
    
    try {
        const result = await makeRequest('/session/data', {
            method: 'POST',
            body: JSON.stringify({ key, value })
        });
        
        showMessage('saveResult', `Dados salvos com sucesso! Chave: ${key}`);
        
        // Limpar os campos
        document.getElementById('dataKey').value = '';
        document.getElementById('dataValue').value = '';
        
        // Atualizar informações da sessão
        loadSessionInfo();
        
    } catch (error) {
        showMessage('saveResult', `Erro ao salvar: ${error.message}`, true);
    }
}

// Buscar dados específicos
async function getData() {
    const key = document.getElementById('searchKey').value.trim();
    
    if (!key) {
        showMessage('searchResult', 'Por favor, informe uma chave para buscar', true);
        return;
    }
    
    try {
        const result = await makeRequest(`/session/data/${key}`);
        
        const formattedValue = typeof result.value === 'object' 
            ? JSON.stringify(result.value, null, 2)
            : result.value;
            
        document.getElementById('searchResult').innerHTML = `
            <div class="success">
                <strong>Chave:</strong> ${result.key}<br>
                <strong>Valor:</strong><br>
                <div class="data-display">${formattedValue}</div>
            </div>
        `;
        
    } catch (error) {
        showMessage('searchResult', `Erro ao buscar dados: ${error.message}`, true);
    }
}

// Carregar todos os dados da sessão
async function loadAllData() {
    try {
        const sessionData = await makeRequest('/session');
        
        const allDataDiv = document.getElementById('allData');
        
        if (Object.keys(sessionData.data || {}).length === 0) {
            allDataDiv.innerHTML = 'Nenhum dado armazenado na sessão.';
        } else {
            allDataDiv.innerHTML = JSON.stringify(sessionData.data, null, 2);
        }
        
    } catch (error) {
        showMessage('allData', `Erro ao carregar dados: ${error.message}`, true);
    }
}

// Remover dados específicos
async function removeData() {
    const key = document.getElementById('removeKey').value.trim();
    
    if (!key) {
        showMessage('removeResult', 'Por favor, informe uma chave para remover', true);
        return;
    }
    
    try {
        const result = await makeRequest(`/session/data/${key}`, {
            method: 'DELETE'
        });
        
        showMessage('removeResult', result.message);
        
        // Limpar o campo
        document.getElementById('removeKey').value = '';
        
        // Atualizar informações da sessão
        loadSessionInfo();
        loadAllData();
        
    } catch (error) {
        showMessage('removeResult', `Erro ao remover dados: ${error.message}`, true);
    }
}

// Limpar todos os dados da sessão
async function clearAllData() {
    if (!confirm('Tem certeza que deseja limpar todos os dados da sessão?')) {
        return;
    }
    
    try {
        const result = await makeRequest('/session/data', {
            method: 'DELETE'
        });
        
        showMessage('removeResult', result.message);
        
        // Atualizar informações da sessão
        loadSessionInfo();
        loadAllData();
        
    } catch (error) {
        showMessage('removeResult', `Erro ao limpar dados: ${error.message}`, true);
    }
}

// Destruir sessão completamente
async function destroySession() {
    if (!confirm('Tem certeza que deseja destruir completamente a sessão? Uma nova sessão será criada na próxima requisição.')) {
        return;
    }
    
    try {
        const result = await makeRequest('/session/destroy', {
            method: 'POST'
        });
        
        showMessage('destroyResult', result.message);
        
        // Recarregar a página após destruir a sessão
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        
    } catch (error) {
        showMessage('destroyResult', `Erro ao destruir sessão: ${error.message}`, true);
    }
}

// Carregar informações da sessão quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    loadSessionInfo();
    loadAllData();
});

// Adicionar evento Enter nos campos de input
document.getElementById('dataKey').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('dataValue').focus();
    }
});

document.getElementById('dataValue').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        saveData();
    }
});

document.getElementById('searchKey').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getData();
    }
});

document.getElementById('removeKey').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        removeData();
    }
});

// Classe para gerenciar sessões (para uso em outros projetos)
class SessionManager {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }
    
    async makeRequest(url, options = {}) {
        return makeRequest(url, options);
    }
    
    async getSession() {
        return await this.makeRequest('/session');
    }
    
    async saveData(key, value) {
        return await this.makeRequest('/session/data', {
            method: 'POST',
            body: JSON.stringify({ key, value })
        });
    }
    
    async getData(key) {
        return await this.makeRequest(`/session/data/${key}`);
    }
    
    async removeData(key) {
        return await this.makeRequest(`/session/data/${key}`, {
            method: 'DELETE'
        });
    }
    
    async clearAllData() {
        return await this.makeRequest('/session/data', {
            method: 'DELETE'
        });
    }
    
    async destroySession() {
        return await this.makeRequest('/session/destroy', {
            method: 'POST'
        });
    }
}

// Exportar a classe para uso em outros arquivos
window.SessionManager = SessionManager;

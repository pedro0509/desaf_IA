# 👥 Sistema de Histórico Separado por Grupos

## 📝 **Descrição**

O sistema agora suporta histórico de conversas separado por grupos. Cada grupo mantém seu próprio histórico de perguntas e respostas da IA, permitindo contextos independentes para cada equipe.

## 🔧 **Funcionalidades Implementadas**

### ✅ **Histórico por Grupo**
- Cada grupo tem seu próprio histórico de conversas
- As respostas da IA levam em conta apenas o contexto do grupo específico
- Grupos não interferem no histórico uns dos outros

### ✅ **Compatibilidade**
- Mantém compatibilidade com o sistema anterior
- Histórico geral ainda existe para casos especiais
- Transição suave sem quebrar funcionalidades existentes

## 🚀 **Como Usar**

### **1. Frontend (Automático)**
O frontend agora envia automaticamente o ID do grupo atual:

```javascript
// Enviar pergunta (automático no quiz.js)
const response = await fetch('/api/ia/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
        pergunta: "Qual é a diferença entre classe e objeto?",
        grupoId: 1, // ID do grupo atual
        quizConfig: quizConfig
    })
});
```

### **2. Consultar Histórico de Grupo Específico**

```javascript
// Via browser console ou JavaScript
const historico = await obterHistoricoGrupo(1);
console.log(historico);
```

### **3. Consultar Histórico Completo**

```javascript
// Via browser console ou JavaScript
const historicoCompleto = await obterHistoricoCompleto();
console.log(historicoCompleto);
```

## 🧪 **Testando no Console do Browser**

Abra o console do navegador (F12) na página do quiz e execute:

```javascript
// Ver histórico do grupo atual
await mostrarHistoricoGrupo(1);

// Ver histórico completo de todos os grupos
await mostrarHistoricoCompleto();

// Ver apenas histórico do grupo 2
await mostrarHistoricoGrupo(2);
```

## 📊 **Estrutura dos Dados**

### **Sessão com Grupos**
```json
{
    "sessionId": "uuid-da-sessao",
    "gameData": {
        "courseName": "Análise e Desenvolvimento",
        "quizTheme": "Programação Orientada a Objetos",
        "questionCount": 3,
        "teamCount": 4,
        "historico": [], // Histórico geral (compatibilidade)
        "historicoPorGrupo": {
            "1": [
                {"role": "user", "content": "O que é encapsulamento?"},
                {"role": "assistant", "content": "Encapsulamento é..."}
            ],
            "2": [
                {"role": "user", "content": "Explique herança"},
                {"role": "assistant", "content": "Herança é..."}
            ],
            "3": [],
            "4": []
        }
    }
}
```

## 🔗 **APIs Disponíveis**

### **POST /api/ia/ask**
Enviar pergunta com ID do grupo:

```json
{
    "pergunta": "O que é polimorfismo?",
    "grupoId": 2
}
```

**Resposta:**
```json
{
    "message": "Pergunta processada com sucesso",
    "pergunta": "O que é polimorfismo?",
    "resposta": "Polimorfismo é...",
    "grupoId": 2,
    "totalMensagensGrupo": 6
}
```

### **GET /api/ia/history?grupoId=1**
Obter histórico do grupo 1:

```json
{
    "message": "Histórico do Grupo 1 obtido com sucesso",
    "grupoId": 1,
    "historico": [...],
    "total_mensagens": 4
}
```

### **GET /api/ia/history**
Obter histórico completo:

```json
{
    "message": "Histórico completo obtido com sucesso",
    "historicoPorGrupo": {
        "1": [...],
        "2": [...],
        "3": [...],
        "4": [...]
    },
    "total_grupos": 4,
    "total_mensagens_geral": 12
}
```

## ⚠️ **Validações**

- ✅ ID do grupo é obrigatório ao enviar perguntas
- ✅ ID do grupo deve ser um número válido (1, 2, 3, etc.)
- ✅ ID do grupo não pode exceder o número total de grupos
- ✅ Histórico é inicializado automaticamente para todos os grupos
- ✅ Compatibilidade com sessões antigas sem histórico por grupo

## 🔍 **Debugging**

### **Ver Estado Atual dos Grupos**
```javascript
// No console do browser
console.log('Grupo atual:', currentTeam);
console.log('Total de grupos:', totalTeams);
console.log('Progresso dos grupos:', teamsProgress);
```

### **Verificar Histórico de Todos os Grupos**
```javascript
// Ver resumo de todos os grupos
const historico = await mostrarHistoricoCompleto();
```

### **Análise Detalhada por Grupo**
```javascript
// Analisar cada grupo individualmente
for(let i = 1; i <= 4; i++) {
    console.log(`=== GRUPO ${i} ===`);
    await mostrarHistoricoGrupo(i);
}
```

## 📈 **Vantagens do Sistema**

1. **Contexto Isolado**: Cada grupo tem suas próprias conversas
2. **IA Mais Precisa**: Respostas baseadas no histórico específico do grupo
3. **Análise Individual**: Possibilidade de analisar o desempenho de cada grupo
4. **Escalabilidade**: Suporta qualquer número de grupos
5. **Compatibilidade**: Não quebra funcionalidades existentes

## 🎯 **Próximos Passos**

- [ ] Interface para visualizar histórico por grupo
- [ ] Relatórios de análise por grupo
- [ ] Exportação de dados por grupo
- [ ] Estatísticas de desempenho por grupo

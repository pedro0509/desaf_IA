# 📋 Documentação das APIs - Desaf.IA

## 🔗 **Endpoints Configurados**

### **📍 Base URL**: `http://localhost:3000`

---

## 🎯 **Sessões** (`/api/session`)

### **POST** `/api/session/create-session`
Cria uma nova sessão de jogo com os dados do formulário.

**Body:**
```json
{
    "courseName": "Análise e Desenvolvimento de Sistemas",
    "quizTheme": "Programação Orientada a Objetos",
    "questionCount": 10,
    "teamCount": 2
}
```

**Response (201):**
```json
{
    "message": "Sessão criada com sucesso",
    "sessionId": "uuid-da-sessao",
    "gameData": {
        "courseName": "...",
        "quizTheme": "...",
        "questionCount": 10,
        "teamCount": 2,
        "createdAt": "2025-07-30T...",
        "status": "created"
    }
}
```

### **GET** `/api/session/game-session`
Obtém os dados da sessão atual do jogo.

**Response (200):**
```json
{
    "message": "Dados da sessão obtidos com sucesso",
    "sessionId": "uuid-da-sessao",
    "gameData": {
        "courseName": "...",
        "quizTheme": "...",
        "questionCount": 10,
        "teamCount": 2,
        "createdAt": "2025-07-30T...",
        "status": "created"
    },
    "createdAt": "2025-07-30T..."
}
```

---

## 🤖 **Inteligência Artificial** (`/api/ia`)

### **POST** `/api/ia/ask`
Envia uma pergunta para a IA e recebe uma resposta. Agora suporta histórico separado por grupos.

**Body:**
```json
{
    "pergunta": "O que é programação orientada a objetos?",
    "grupoId": 1,
    "contexto": "Contexto adicional opcional"
}
```

**Response (200):**
```json
{
    "message": "Pergunta processada com sucesso",
    "pergunta": "O que é programação orientada a objetos?",
    "resposta": "Programação orientada a objetos é...",
    "tokens_utilizados": 150,
    "sessionId": "uuid-da-sessao",
    "grupoId": 1,
    "totalMensagensGrupo": 4
}
```

### **POST** `/api/ia/generate-questions`
Gera perguntas de quiz usando IA baseadas nos dados da sessão.

**Response (200):**
```json
{
    "message": "Perguntas geradas com sucesso",
    "questions": [
        {
            "id": 1,
            "pergunta": "Qual é o conceito de herança em POO?",
            "opcoes": [
                "Opção A", 
                "Opção B", 
                "Opção C", 
                "Opção D"
            ],
            "resposta_correta": 0,
            "explicacao": "Explicação da resposta"
        }
    ],
    "total": 10,
    "sessionId": "uuid-da-sessao"
}
```

### **GET** `/api/ia/history`
Obtém o histórico de conversas com a IA. Suporta consulta por grupo específico ou histórico completo.

**Query Parameters:**
- `grupoId` (opcional): ID do grupo para obter histórico específico (ex: `?grupoId=1`)

**Response para grupo específico (200):**
```json
{
    "message": "Histórico do Grupo 1 obtido com sucesso",
    "grupoId": 1,
    "historico": [
        {
            "role": "user",
            "content": "Pergunta do usuário"
        },
        {
            "role": "assistant", 
            "content": "Resposta da IA"
        }
    ],
    "total_mensagens": 2,
    "sessionId": "uuid-da-sessao"
}
```

**Response para histórico completo (200):**
```json
{
    "message": "Histórico completo obtido com sucesso",
    "historicoPorGrupo": {
        "1": [
            {"role": "user", "content": "Pergunta grupo 1"},
            {"role": "assistant", "content": "Resposta grupo 1"}
        ],
        "2": [
            {"role": "user", "content": "Pergunta grupo 2"},
            {"role": "assistant", "content": "Resposta grupo 2"}
        ]
    },
    "total_grupos": 2,
    "total_mensagens_geral": 4,
    "sessionId": "uuid-da-sessao",
    "historico": [],
    "total_mensagens": 0
}
```

---

## 🏥 **Sistema** 

### **GET** `/health`
Verifica o status do servidor.

**Response (200):**
```json
{
    "status": "OK",
    "timestamp": "2025-07-30T12:00:00.000Z",
    "environment": "development"
}
```

---

## 🔧 **Frontend Integration**

### **JavaScript Examples**

#### **1. Criar Sessão (index.html)**
```javascript
const response = await fetch('/api/session/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
        courseName: 'Meu Curso',
        quizTheme: 'Meu Tema', 
        questionCount: 10,
        teamCount: 2
    })
});
```

#### **2. Obter Sessão (quiz.html)**
```javascript
const response = await fetch('/api/session/game-session', {
    method: 'GET',
    credentials: 'include'
});
```

#### **3. Gerar Perguntas com IA**
```javascript
const response = await fetch('/api/ia/generate-questions', {
    method: 'POST',
    credentials: 'include'
});
```

#### **4. Enviar Pergunta para IA (com grupo)**
```javascript
const response = await fetch('/api/ia/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
        pergunta: 'Minha pergunta',
        grupoId: 1,
        contexto: 'Contexto opcional'
    })
});
```

#### **5. Obter Histórico de Grupo Específico**
```javascript
const response = await fetch('/api/ia/history?grupoId=1', {
    method: 'GET',
    credentials: 'include'
});
```

#### **6. Obter Histórico Completo de Todos os Grupos**
```javascript
const response = await fetch('/api/ia/history', {
    method: 'GET',
    credentials: 'include'
});
```

---

## ⚠️ **Códigos de Erro**

- **400 Bad Request**: Dados inválidos ou campos obrigatórios faltando
- **401 Unauthorized**: Sessão inválida ou expirada
- **404 Not Found**: Recurso não encontrado (ex: sessão não existe)
- **500 Internal Server Error**: Erro interno do servidor ou da IA

---

## 🔐 **Autenticação**

- Usa **sessões anônimas** com cookies `httpOnly`
- Sempre incluir `credentials: 'include'` nas requisições
- Sessões expiram em 24 horas
- Não requer login tradicional

---

## 🎯 **Status das Rotas**

✅ **Implementadas e Testadas:**
- `/api/session/create-session` 
- `/api/session/game-session`
- `/api/ia/ask` (com suporte a grupos)
- `/api/ia/history` (histórico por grupos)

🔧 **A Implementar:**
- `/api/ia/generate-questions` 

📝 **Funcionalidades Adicionadas:**
- ✅ Histórico separado por grupos
- ✅ Consulta de histórico por grupo específico
- ✅ Consulta de histórico completo de todos os grupos
- ✅ Validação de IDs de grupos
- ✅ Compatibilidade com versão anterior

📝 **Próximos Passos:**
1. Criar os arquivos de service, controller e routes
2. Configurar Azure OpenAI
3. Testar integração completa

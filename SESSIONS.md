# Sistema de Sessões Anônimas

Este sistema permite trabalhar com sessões de usuário sem necessidade de login ou autenticação. Cada visitante recebe automaticamente uma sessão única e anônima.

## Como Funciona

- Cada usuário que acessa a aplicação recebe automaticamente um ID de sessão único
- Os dados da sessão são armazenados no servidor usando cookies httpOnly
- A sessão expira em 24 horas por padrão
- Não é necessário login ou registro

## Endpoints Disponíveis

### GET /session
Retorna informações sobre a sessão atual do usuário.

**Resposta:**
```json
{
  "sessionId": "uuid-da-sessao",
  "createdAt": "2025-07-25T...",
  "data": {}
}
```

### POST /session/data
Salva dados na sessão do usuário.

**Body:**
```json
{
  "key": "nome_do_campo",
  "value": "valor_a_ser_salvo"
}
```

**Resposta:**
```json
{
  "message": "Dados salvos na sessão",
  "sessionId": "uuid-da-sessao",
  "data": {
    "nome_do_campo": "valor_a_ser_salvo"
  }
}
```

### GET /session/data/:key
Obtém um valor específico salvo na sessão.

**Resposta:**
```json
{
  "key": "nome_do_campo",
  "value": "valor_salvo",
  "sessionId": "uuid-da-sessao"
}
```

### DELETE /session/data/:key
Remove um campo específico da sessão.

**Resposta:**
```json
{
  "message": "Chave 'nome_do_campo' removida da sessão",
  "sessionId": "uuid-da-sessao"
}
```

### DELETE /session/data
Remove todos os dados da sessão (mantém a sessão ativa).

**Resposta:**
```json
{
  "message": "Todos os dados da sessão foram limpos",
  "sessionId": "uuid-da-sessao"
}
```

### POST /session/destroy
Destrói completamente a sessão do usuário.

**Resposta:**
```json
{
  "message": "Sessão destruída com sucesso",
  "destroyedSessionId": "uuid-da-sessao"
}
```

## Exemplos de Uso

### JavaScript (Frontend)
```javascript
// Obter informações da sessão
fetch('/session', { credentials: 'include' })
  .then(response => response.json())
  .then(data => console.log(data));

// Salvar dados na sessão
fetch('/session/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    key: 'preferencias',
    value: { tema: 'escuro', idioma: 'pt-BR' }
  })
});

// Obter dados específicos
fetch('/session/data/preferencias', { credentials: 'include' })
  .then(response => response.json())
  .then(data => console.log(data));
```

### cURL
```bash
# Obter sessão
curl -c cookies.txt http://localhost:3000/session

# Salvar dados
curl -b cookies.txt -X POST http://localhost:3000/session/data \
  -H "Content-Type: application/json" \
  -d '{"key": "nome", "value": "João"}'

# Obter dados
curl -b cookies.txt http://localhost:3000/session/data/nome
```

## Configuração

No arquivo `.env`:
- `SESSION_SECRET`: Chave secreta para assinar cookies (mude em produção)
- `PORT`: Porta do servidor

## Considerações de Segurança

- O cookie de sessão é httpOnly (não acessível via JavaScript)
- Em produção, configure `secure: true` para HTTPS
- Mude o SESSION_SECRET para um valor seguro e único
- Considere usar um store persistente (Redis, MongoDB) em vez de memória

## Limitações Atuais

- Dados da sessão são perdidos quando o servidor reinicia
- Armazenamento em memória não é adequado para múltiplas instâncias
- Para produção, considere usar express-session com um store persistente

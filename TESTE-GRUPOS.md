# 🧪 Como Testar o Sistema de Histórico por Grupos

## 🚀 **Teste Rápido**

### **1. Iniciar o Servidor**
```bash
npm start
# ou
node index.js
```

### **2. Acessar o Sistema**
1. Vá para `http://localhost:3000`
2. Preencha o formulário:
   - **Nome do Curso**: "Análise e Desenvolvimento de Sistemas"
   - **Tema**: "Programação Orientada a Objetos"  
   - **Perguntas por Grupo**: 3
   - **Quantidade de Equipes**: 4
3. Clique em "Iniciar Jogo!"

### **3. Fazer Perguntas por Grupo**

#### **Grupo 1**
- Faça uma pergunta: "O que é encapsulamento em POO?"
- Veja a resposta da IA
- Clique em "Próximo Grupo"

#### **Grupo 2**  
- Faça uma pergunta: "Explique o conceito de herança"
- Veja a resposta da IA
- Clique em "Próximo Grupo"

#### **Grupo 3**
- Faça uma pergunta: "O que é polimorfismo?"
- Veja a resposta da IA
- Clique em "Próximo Grupo"

#### **Grupo 4**
- Faça uma pergunta: "Qual a diferença entre classe e objeto?"
- Veja a resposta da IA

### **4. Verificar Histórico no Console**

Abra o console do navegador (F12) e execute:

```javascript
// Ver histórico de todos os grupos
await mostrarHistoricoCompleto();

// Ver histórico específico do Grupo 1
await mostrarHistoricoGrupo(1);

// Ver histórico específico do Grupo 2  
await mostrarHistoricoGrupo(2);
```

## 📋 **Teste de Validação**

### **Teste 1: Histórico Isolado**
```javascript
// Cada grupo deve ter apenas suas próprias mensagens
for(let i = 1; i <= 4; i++) {
    const hist = await obterHistoricoGrupo(i);
    console.log(`Grupo ${i}: ${hist.total_mensagens} mensagens`);
}
```

### **Teste 2: Grupo Inválido**
```javascript
// Tentar acessar grupo que não existe (deve dar erro)
try {
    await obterHistoricoGrupo(999);
} catch(error) {
    console.log('Erro esperado:', error.message);
}
```

### **Teste 3: Continuidade de Contexto**
```javascript
// Fazer várias perguntas no mesmo grupo e verificar contexto
// Grupo 1: Pergunta 1 -> Pergunta 2 relacionada -> Ver se IA lembra
```

## 🔍 **Verificações Esperadas**

### ✅ **Funcionamento Correto**
- [ ] Cada grupo mantém histórico separado
- [ ] IA responde baseada apenas no contexto do grupo atual  
- [ ] Mudança de grupo limpa a interface mas mantém históricos
- [ ] API retorna histórico correto por grupo
- [ ] Validação de grupos inexistentes funciona
- [ ] Total de mensagens por grupo está correto

### ✅ **Interface**
- [ ] Indicador visual do grupo atual
- [ ] Histórico não "vaza" entre grupos
- [ ] Console mostra logs específicos por grupo
- [ ] Transição suave entre grupos

## 🐛 **Problemas Possíveis e Soluções**

### **Erro: "ID do grupo é obrigatório"**
**Causa**: Frontend não está enviando `grupoId`
**Solução**: Verificar se `currentTeam` está definido

### **Erro: "Grupo X não existe"**
**Causa**: ID do grupo maior que `teamCount`
**Solução**: Verificar configuração do jogo

### **Histórico vazio**
**Causa**: Grupo ainda não fez perguntas
**Solução**: Normal, fazer perguntas primeiro

## 📊 **Exemplo de Fluxo Completo**

```
1. Criar jogo (4 grupos, 3 perguntas cada)
2. Grupo 1: "O que é POO?" → IA responde
3. Grupo 2: "Diferença entre classe e objeto?" → IA responde  
4. Grupo 3: "Como funciona herança?" → IA responde
5. Grupo 4: "Explique polimorfismo" → IA responde
6. Grupo 1: "E o encapsulamento?" → IA responde (com contexto do Grupo 1)
7. Verificar: Grupo 1 tem 2 perguntas, outros têm 1 cada
```

## 🎯 **Comandos de Teste Avançado**

### **Teste de Stress**
```javascript
// Fazer múltiplas perguntas rapidamente
for(let grupo = 1; grupo <= 4; grupo++) {
    for(let pergunta = 1; pergunta <= 3; pergunta++) {
        await fetch('/api/ia/ask', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                pergunta: `Pergunta ${pergunta} do grupo ${grupo}`,
                grupoId: grupo
            })
        });
    }
}
```

### **Análise de Performance**
```javascript
// Medir tempo de resposta por grupo
const inicio = performance.now();
const historico = await obterHistoricoCompleto();
const fim = performance.now();
console.log(`Consulta completa levou ${fim - inicio}ms`);
```

### **Teste de Concorrência**
```javascript
// Simular múltiplos grupos fazendo perguntas simultaneamente
Promise.all([
    fetch('/api/ia/ask', {method: 'POST', body: JSON.stringify({pergunta: 'Teste 1', grupoId: 1})}),
    fetch('/api/ia/ask', {method: 'POST', body: JSON.stringify({pergunta: 'Teste 2', grupoId: 2})}),
    fetch('/api/ia/ask', {method: 'POST', body: JSON.stringify({pergunta: 'Teste 3', grupoId: 3})})
]);
```

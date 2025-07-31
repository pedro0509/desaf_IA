# 📊 Página de Resultados - Sistema de Histórico por Grupos

## 🎯 **Descrição**

A página `resultados.html` exibe de forma visual e organizada todo o histórico de perguntas e respostas de cada grupo, com funcionalidades avançadas de análise e exportação.

## 🌟 **Funcionalidades**

### ✅ **Visualização por Grupos**
- Cards coloridos para cada grupo (cores diferentes)
- Histórico completo de perguntas e respostas
- Estatísticas individuais por grupo
- Indicação visual de grupos sem atividade

### ✅ **Estatísticas Gerais**
- Total de grupos participantes
- Total de perguntas feitas
- Total de respostas da IA
- Média de perguntas por grupo

### ✅ **Exportação de Dados**
- **JSON**: Dados completos estruturados
- **CSV**: Para análise em planilhas
- **Texto**: Formato legível para relatórios
- **Impressão**: Layout otimizado para impressão

### ✅ **Funcionalidades Avançadas**
- Estatísticas detalhadas via console
- Análise de grupo mais ativo
- Identificação da pergunta mais longa
- Design responsivo para mobile

## 🚀 **Como Acessar**

### **Método 1: Automático (Após Completar Quiz)**
1. Complete todas as perguntas do quiz
2. Aguarde a mensagem de parabéns
3. Será redirecionado automaticamente em 3 segundos

### **Método 2: Manual**
1. Acesse `http://localhost:3000/resultados.html`
2. (Requer sessão ativa com dados de jogo)

### **Método 3: Via Quiz em Andamento**
1. Na página do quiz, no console (F12) execute:
```javascript
window.location.href = 'resultados.html';
```

## 📱 **Interface**

### **Cabeçalho**
- Nome do curso e tema do quiz
- Botões de ação (Exportar, Novo Jogo, Voltar)

### **Estatísticas Gerais**
```
[4] Total de Grupos    [12] Total de Perguntas
[12] Total de Respostas [3.0] Média por Grupo
```

### **Cards dos Grupos**
Cada grupo tem um card colorido com:
- **Cabeçalho**: Nome do grupo + estatísticas
- **Corpo**: Histórico de perguntas e respostas
- **Cores**: Diferentes para cada grupo (vermelho, verde, azul, laranja, etc.)

### **Estados da Página**
- **Loading**: Spinner enquanto carrega dados
- **Erro**: Mensagem de erro com botão "Tentar Novamente"
- **Sem Resultados**: Quando nenhum grupo fez perguntas
- **Com Dados**: Exibição normal dos resultados

## 💾 **Opções de Exportação**

### **1. JSON (Completo)**
```json
{
  "jogo": {
    "curso": "Análise e Desenvolvimento",
    "tema": "Programação Orientada a Objetos",
    "totalGrupos": 4,
    "perguntasPorGrupo": 3
  },
  "historicoPorGrupo": {
    "1": [...],
    "2": [...],
    "3": [...],
    "4": [...]
  }
}
```

### **2. CSV (Para Planilhas)**
```csv
Grupo,Tipo,Numero,Conteudo,Timestamp
1,"Pergunta",1,"O que é encapsulamento?","2025-01-31..."
1,"Resposta",1,"Encapsulamento é...","2025-01-31..."
```

### **3. Texto (Relatório)**
```
RESULTADOS DO QUIZ - DESAF.IA
==========================================

Curso: Análise e Desenvolvimento de Sistemas
Tema: Programação Orientada a Objetos
Total de Grupos: 4

GRUPO 1
--------------------
1. PERGUNTA:
O que é encapsulamento em POO?

1. RESPOSTA:
Encapsulamento é...
```

## 🔍 **Análise Avançada (Console)**

Abra o console (F12) e execute comandos para análise detalhada:

### **Estatísticas Completas**
```javascript
// Ver todas as estatísticas
mostrarEstatisticas();

// Gerar dados estatísticos
const stats = gerarEstatisticasDetalhadas();
console.log(stats);
```

### **Análise Específica**
```javascript
// Encontrar grupo mais ativo
const maisAtivo = grupoMaisAtivo();
console.log(`Grupo mais ativo: ${maisAtivo.grupo} com ${maisAtivo.perguntas} perguntas`);

// Encontrar pergunta mais longa
const pergunta = perguntaMaisLonga();
console.log(`Pergunta mais longa: Grupo ${pergunta.grupo} - ${pergunta.tamanho} caracteres`);
```

### **Exportação Programática**
```javascript
// Exportar via JavaScript
exportarCSV();        // Baixa arquivo CSV
exportarTexto();      // Baixa arquivo de texto
imprimirResultados(); // Abre janela de impressão
```

## 📊 **Estrutura dos Cards**

### **Grupo com Atividade**
```html
┌─────────────────────────────────────┐
│ 👥 Grupo 1                3 perguntas │
├─────────────────────────────────────┤
│ 👤 Pergunta do Grupo                │
│    O que é encapsulamento?          │
│                                     │
│ 🤖 Resposta da IA                   │
│    Encapsulamento é...              │
└─────────────────────────────────────┘
```

### **Grupo Sem Atividade**
```html
┌─────────────────────────────────────┐
│ 👥 Grupo 3                0 perguntas │
├─────────────────────────────────────┤
│        💬                           │
│ Este grupo ainda não fez            │
│ nenhuma pergunta.                   │
└─────────────────────────────────────┘
```

## ⚙️ **Configuração de Cores**

Cores automáticas por grupo (CSS):
- **Grupo 1**: Vermelho (`#dc3545`)
- **Grupo 2**: Verde (`#28a745`)
- **Grupo 3**: Azul (`#007bff`)
- **Grupo 4**: Laranja (`#fd7e14`)
- **Grupo 5**: Roxo (`#6f42c1`)
- **Grupo 6**: Teal (`#20c997`)

## 🔧 **Troubleshooting**

### **Erro: "Erro ao carregar dados do jogo"**
- **Causa**: Sessão inválida ou expirada
- **Solução**: Voltar ao início e criar novo jogo

### **Erro: "Erro ao carregar histórico"**
- **Causa**: Problema na API ou sessão
- **Solução**: Tentar novamente ou verificar console

### **Página em branco**
- **Causa**: JavaScript desabilitado ou erro de carregamento
- **Solução**: Recarregar página, verificar console

### **Exportação não funciona**
- **Causa**: Bloqueador de pop-up ou dados não carregados
- **Solução**: Permitir downloads, aguardar carregamento completo

## 📱 **Responsividade**

### **Desktop (> 768px)**
- Layout em grid com cards lado a lado
- Botões completos com texto
- Ícones posicionados ao lado das mensagens

### **Mobile (≤ 768px)**
- Cards empilhados verticalmente
- Botões compactos
- Ícones acima das mensagens
- Texto otimizado para tela pequena

## 🎯 **Próximas Melhorias**

- [ ] Filtros por grupo
- [ ] Ordenação por atividade
- [ ] Gráficos de estatísticas
- [ ] Comparação entre grupos
- [ ] Timeline de atividades
- [ ] Exportação em PDF

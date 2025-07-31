// ==========================================
// RESULTADOS.JS - Sistema de Exibição de Resultados
// ==========================================

// ==========================================
// FUNÇÕES DE EXPORTAÇÃO AVANÇADA
// ==========================================

/**
 * Exportar resultados em formato CSV
 */
function exportarCSV() {
    if (!historicoCompleto || !dadosJogo) {
        alert('Nenhum dado para exportar');
        return;
    }

    let csvContent = 'Grupo,Tipo,Numero,Conteudo,Timestamp\n';
    
    Object.entries(historicoCompleto.historicoPorGrupo).forEach(([grupoId, historico]) => {
        let numeroMensagem = 1;
        historico.forEach(mensagem => {
            const tipo = mensagem.role === 'user' ? 'Pergunta' : 'Resposta';
            const conteudo = mensagem.content.replace(/"/g, '""').replace(/\n/g, ' ');
            const timestamp = new Date().toISOString();
            
            csvContent += `${grupoId},"${tipo}",${numeroMensagem},"${conteudo}","${timestamp}"\n`;
            numeroMensagem++;
        });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historico-grupos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
}

/**
 * Exportar resultados em formato texto
 */
function exportarTexto() {
    if (!historicoCompleto || !dadosJogo) {
        alert('Nenhum dado para exportar');
        return;
    }

    let conteudo = `RESULTADOS DO QUIZ - DESAF.IA\n`;
    conteudo += `==========================================\n\n`;
    conteudo += `Curso: ${dadosJogo.courseName}\n`;
    conteudo += `Tema: ${dadosJogo.quizTheme}\n`;
    conteudo += `Total de Grupos: ${dadosJogo.teamCount}\n`;
    conteudo += `Perguntas por Grupo: ${dadosJogo.questionCount}\n`;
    conteudo += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

    Object.entries(historicoCompleto.historicoPorGrupo).forEach(([grupoId, historico]) => {
        conteudo += `GRUPO ${grupoId}\n`;
        conteudo += `${'-'.repeat(20)}\n`;
        
        if (historico.length === 0) {
            conteudo += `Este grupo não fez perguntas.\n\n`;
        } else {
            let numeroMensagem = 1;
            for (let i = 0; i < historico.length; i += 2) {
                const pergunta = historico[i];
                const resposta = historico[i + 1];
                
                if (pergunta && pergunta.role === 'user') {
                    conteudo += `${numeroMensagem}. PERGUNTA:\n${pergunta.content}\n\n`;
                    
                    if (resposta && resposta.role === 'assistant') {
                        conteudo += `${numeroMensagem}. RESPOSTA:\n${resposta.content}\n\n`;
                    }
                    
                    numeroMensagem++;
                }
            }
        }
        conteudo += `\n`;
    });

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historico-quiz-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
}

/**
 * Imprimir resultados
 */
function imprimirResultados() {
    const printWindow = window.open('', '_blank');
    const printContent = gerarConteudoImpressao();
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

function gerarConteudoImpressao() {
    if (!historicoCompleto || !dadosJogo) {
        return '<html><body><p>Nenhum dado para imprimir</p></body></html>';
    }

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resultados do Quiz - ${dadosJogo.courseName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                .grupo { margin-bottom: 30px; page-break-inside: avoid; }
                .grupo-titulo { background: #f5f5f5; padding: 10px; font-weight: bold; }
                .mensagem { margin: 10px 0; padding: 10px; border-left: 3px solid #007bff; }
                .pergunta { background: #e3f2fd; }
                .resposta { background: #f3e5f5; }
                .stats { background: #f8f9fa; padding: 15px; margin-bottom: 20px; }
                @media print { 
                    .grupo { page-break-inside: avoid; }
                    body { print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Resultados do Quiz - Desaf.IA</h1>
                <p><strong>Curso:</strong> ${dadosJogo.courseName}</p>
                <p><strong>Tema:</strong> ${dadosJogo.quizTheme}</p>
                <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div class="stats">
                <h3>Estatísticas Gerais</h3>
                <p><strong>Total de Grupos:</strong> ${dadosJogo.teamCount}</p>
                <p><strong>Perguntas Esperadas por Grupo:</strong> ${dadosJogo.questionCount}</p>
                <p><strong>Total de Mensagens:</strong> ${historicoCompleto.total_mensagens_geral || 0}</p>
            </div>
    `;

    Object.entries(historicoCompleto.historicoPorGrupo).forEach(([grupoId, historico]) => {
        html += `<div class="grupo">`;
        html += `<div class="grupo-titulo">GRUPO ${grupoId}</div>`;
        
        if (historico.length === 0) {
            html += `<p style="font-style: italic; color: #666;">Este grupo não fez perguntas.</p>`;
        } else {
            let numeroMensagem = 1;
            for (let i = 0; i < historico.length; i += 2) {
                const pergunta = historico[i];
                const resposta = historico[i + 1];
                
                if (pergunta && pergunta.role === 'user') {
                    html += `<div class="mensagem pergunta">`;
                    html += `<strong>Pergunta ${numeroMensagem}:</strong><br>`;
                    html += escapeHtml(pergunta.content);
                    html += `</div>`;
                    
                    if (resposta && resposta.role === 'assistant') {
                        html += `<div class="mensagem resposta">`;
                        html += `<strong>Resposta ${numeroMensagem}:</strong><br>`;
                        html += escapeHtml(resposta.content);
                        html += `</div>`;
                    }
                    
                    numeroMensagem++;
                }
            }
        }
        
        html += `</div>`;
    });

    html += `
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
                <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')} - Desaf.IA</p>
            </div>
        </body>
        </html>
    `;

    return html;
}

// ==========================================
// ANÁLISE ESTATÍSTICA AVANÇADA
// ==========================================

/**
 * Gerar estatísticas detalhadas
 */
function gerarEstatisticasDetalhadas() {
    if (!historicoCompleto || !dadosJogo) {
        console.error('Dados não carregados');
        return null;
    }

    const stats = {
        jogo: {
            curso: dadosJogo.courseName,
            tema: dadosJogo.quizTheme,
            totalGrupos: dadosJogo.teamCount,
            perguntasEsperadas: dadosJogo.questionCount
        },
        grupos: {},
        totais: {
            perguntas: 0,
            respostas: 0,
            caracteresPerguntas: 0,
            caracteresRespostas: 0
        },
        medias: {}
    };

    // Analisar cada grupo
    Object.entries(historicoCompleto.historicoPorGrupo).forEach(([grupoId, historico]) => {
        const perguntas = historico.filter(msg => msg.role === 'user');
        const respostas = historico.filter(msg => msg.role === 'assistant');
        
        const caracteresPerguntas = perguntas.reduce((acc, msg) => acc + msg.content.length, 0);
        const caracteresRespostas = respostas.reduce((acc, msg) => acc + msg.content.length, 0);
        
        stats.grupos[grupoId] = {
            numeroPerguntas: perguntas.length,
            numeroRespostas: respostas.length,
            caracteresPerguntas,
            caracteresRespostas,
            mediaCaracteresPergunta: perguntas.length > 0 ? Math.round(caracteresPerguntas / perguntas.length) : 0,
            mediaCaracteresResposta: respostas.length > 0 ? Math.round(caracteresRespostas / respostas.length) : 0,
            percentualCompleto: Math.round((perguntas.length / dadosJogo.questionCount) * 100)
        };

        // Somar aos totais
        stats.totais.perguntas += perguntas.length;
        stats.totais.respostas += respostas.length;
        stats.totais.caracteresPerguntas += caracteresPerguntas;
        stats.totais.caracteresRespostas += caracteresRespostas;
    });

    // Calcular médias gerais
    stats.medias = {
        perguntasPorGrupo: Math.round(stats.totais.perguntas / dadosJogo.teamCount * 10) / 10,
        caracteresPerPergunta: stats.totais.perguntas > 0 ? Math.round(stats.totais.caracteresPerguntas / stats.totais.perguntas) : 0,
        caracteresPerResposta: stats.totais.respostas > 0 ? Math.round(stats.totais.caracteresRespostas / stats.totais.respostas) : 0
    };

    return stats;
}

/**
 * Mostrar estatísticas no console
 */
function mostrarEstatisticas() {
    const stats = gerarEstatisticasDetalhadas();
    if (!stats) return;

    console.log('=== ESTATÍSTICAS DETALHADAS ===');
    console.table(stats.grupos);
    console.log('Totais:', stats.totais);
    console.log('Médias:', stats.medias);
}

/**
 * Encontrar grupo mais ativo
 */
function grupoMaisAtivo() {
    const stats = gerarEstatisticasDetalhadas();
    if (!stats) return null;

    let maxPerguntas = 0;
    let grupoMaisAtivo = null;

    Object.entries(stats.grupos).forEach(([grupoId, dados]) => {
        if (dados.numeroPerguntas > maxPerguntas) {
            maxPerguntas = dados.numeroPerguntas;
            grupoMaisAtivo = grupoId;
        }
    });

    return {
        grupo: grupoMaisAtivo,
        perguntas: maxPerguntas
    };
}

/**
 * Encontrar pergunta mais longa
 */
function perguntaMaisLonga() {
    if (!historicoCompleto) return null;

    let maiorPergunta = { content: '', grupo: null, tamanho: 0 };

    Object.entries(historicoCompleto.historicoPorGrupo).forEach(([grupoId, historico]) => {
        historico.forEach(msg => {
            if (msg.role === 'user' && msg.content.length > maiorPergunta.tamanho) {
                maiorPergunta = {
                    content: msg.content,
                    grupo: grupoId,
                    tamanho: msg.content.length
                };
            }
        });
    });

    return maiorPergunta.tamanho > 0 ? maiorPergunta : null;
}

// ==========================================
// FUNÇÕES DE UTILIDADE PARA CONSOLE
// ==========================================

// Expor funções para uso no console do navegador
if (typeof window !== 'undefined') {
    window.exportarCSV = exportarCSV;
    window.exportarTexto = exportarTexto;
    window.imprimirResultados = imprimirResultados;
    window.mostrarEstatisticas = mostrarEstatisticas;
    window.gerarEstatisticasDetalhadas = gerarEstatisticasDetalhadas;
    window.grupoMaisAtivo = grupoMaisAtivo;
    window.perguntaMaisLonga = perguntaMaisLonga;
}

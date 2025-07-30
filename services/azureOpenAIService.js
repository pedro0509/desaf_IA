import { AzureOpenAI } from "openai";
import { azureConfig } from '../config/azureConfig.js';
import { prompts } from '../config/promptsConfig.js';

class AzureOpenAIService {
    constructor() {
        this.client = new AzureOpenAI({
            endpoint: azureConfig.endpoint,
            apiKey: azureConfig.apiKey,
            apiVersion: azureConfig.apiVersion,
            deployment: azureConfig.deployment
        });
    }

    /**
     * Envia uma pergunta para a Azure OpenAI
     * @param {string} pergunta - Pergunta do usuário
     * @param {string} courseName - Nome do curso
     * @param {string} quizTheme - Tema do quiz
     * @param {Array} historico - Histórico da conversa
     * @returns {Object} Resposta da IA
     */
    async enviarPergunta(pergunta, courseName = '', quizTheme = '', historico = []) {
        try {

            const prompt = prompts.contextoQuiz(courseName, quizTheme);

            const messages = [
                {
                    role: "system",
                    content: prompt
                },
                ...historico,
                { role: "user", content: pergunta }
            ];

            const resposta = await this.client.chat.completions.create({
                messages,
                max_tokens: 300,
                temperature: 0.85,
                top_p: 0.9,
                frequency_penalty: 0.2,
                presence_penalty: 0.3,
                stop: null
            });

            const conteudoResposta = resposta.choices[0].message.content;

            return {
                resposta: conteudoResposta,
                historicoAtualizado: [
                    ...historico,
                    { role: "user", content: pergunta },
                    { role: "assistant", content: conteudoResposta }
                ],
                tokens_utilizados: resposta.usage?.total_tokens || 0
            };
        } catch (error) {
            console.error('Erro no Azure OpenAI Service:', error);
            throw new Error('Falha na comunicação com a IA: ' + error.message);
        }
    }
}

export default new AzureOpenAIService();
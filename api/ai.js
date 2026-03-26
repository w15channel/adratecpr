// API de IA para o Portal AD-RATEC PR
// Sistema inteligente de tutoria e suporte educacional

export default async function handler(req, res) {
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { message, context, userId, moduleId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        // Sistema de respostas contextuais
        const responses = {
            rh: {
                keywords: ['rh', 'recursos humanos', 'gestão', 'pessoas', 'recrutamento', 'treinamento'],
                responses: [
                    'Recursos Humanos é a área estratégica que gerencia o capital humano da organização.',
                    'O processo de recrutamento envolve atração, seleção e integração de talentos.',
                    'Treinamento e desenvolvimento são essenciais para manter a equipe atualizada e motivada.',
                    'A gestão de desempenho ajuda a alinhar objetivos individuais com os organizacionais.',
                    'Cultura organizacional é o DNA da empresa e influencia diretamente nos resultados.'
                ]
            },
            financas: {
                keywords: ['finanças', 'dinheiro', 'investimento', 'orçamento', 'fluxo'],
                responses: [
                    'Finanças corporativas envolvem planejamento, análise e controle de recursos financeiros.',
                    'Investimentos devem ser analisados com base no risco, retorno e alinhamento estratégico.',
                    'Orçamento empresarial é a ferramenta de planejamento financeiro por excelência.',
                    'Fluxo de caixa é vital para a saúde financeira de qualquer organização.',
                    'Análise de balanços revela a saúde financeira da empresa.'
                ]
            },
            marketing: {
                keywords: ['marketing', 'venda', 'cliente', 'propaganda', 'digital'],
                responses: [
                    'Marketing é o processo de criar, comunicar e entregar valor aos clientes.',
                    'Marketing digital revolucionou a forma como as empresas se conectam com consumidores.',
                    'Conhecer seu público-alvo é o primeiro passo para qualquer estratégia de marketing.',
                    'Brand building cria valor de longo prazo para a empresa.',
                    'Métricas de marketing ajudam a medir o ROI das campanhas.'
                ]
            },
            programacao: {
                keywords: ['programação', 'código', 'software', 'desenvolvimento', 'tecnologia'],
                responses: [
                    'Programação é a arte de instruir computadores para realizar tarefas específicas.',
                    'Lógica de programação é a base para resolver problemas de forma estruturada.',
                    'Desenvolvimento moderno envolve frontend, backend e integrações.',
                    'Versionamento de código é essencial para trabalho em equipe.',
                    'Testes automatizados garantem a qualidade do software.'
                ]
            }
        };

        // Gerar resposta contextual
        const lowerMessage = message.toLowerCase();
        let response = generateContextualResponse(lowerMessage, responses, context, moduleId);

        // Se não encontrar contexto, dar resposta genérica
        if (!response) {
            response = generateGenericResponse(lowerMessage, context);
        }

        // Simular tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        return res.status(200).json({
            success: true,
            response: response,
            timestamp: new Date().toISOString(),
            context: {
                moduleId: moduleId,
                messageLength: message.length,
                processedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Erro na API de IA:', error);
        return res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
}

function generateContextualResponse(message, responses, context, moduleId) {
    // Buscar resposta baseada no módulo
    if (moduleId && responses[moduleId]) {
        const moduleResponses = responses[moduleId];
        
        // Verificar keywords
        for (const keyword of moduleResponses.keywords) {
            if (message.includes(keyword)) {
                return moduleResponses.responses[Math.floor(Math.random() * moduleResponses.responses.length)];
            }
        }
    }

    // Buscar em todos os módulos
    for (const [module, data] of Object.entries(responses)) {
        for (const keyword of data.keywords) {
            if (message.includes(keyword)) {
                return data.responses[Math.floor(Math.random() * data.responses.length)];
            }
        }
    }

    return null;
}

function generateGenericResponse(message, context) {
    const genericResponses = [
        'Essa é uma ótima pergunta! Continue explorando o conteúdo para aprofundar seu conhecimento.',
        'Para melhor entendimento, revise os materiais complementares disponíveis no módulo.',
        'Pratique com os exercícios propostos para fixar o aprendizado.',
        'Tente relacionar este conceito com situações reais do mercado de trabalho.',
        'A consistência nos estudos é fundamental para o domínio destes conteúdos.',
        'Não hesite em perguntar sempre que tiver dúvidas durante o aprendizado.',
        'A aplicação prática desses conceitos acelerará seu desenvolvimento profissional.',
        'Busque exemplos reais para ilustrar melhor estes conceitos teóricos.',
        'O networking com outros estudantes pode enriquecer sua experiência de aprendizagem.',
        'Lembre-se: a prática leva à perfeição no desenvolvimento profissional.'
    ];

    // Respostas baseadas em tipo de pergunta
    if (message.includes('como') || message.includes('qual')) {
        return 'Para responder essa pergunta, considere os fundamentos teóricos e as aplicações práticas que estudamos. A chave é conectar teoria com realidade do mercado.';
    }

    if (message.includes('por que') || message.includes('why')) {
        return 'Compreender o "porquê" dos conceitos é essencial para o aprendizado profundo. Isso ajuda a aplicar o conhecimento em diferentes contextos profissionais.';
    }

    if (message.includes('exemplo') || message.includes('prática')) {
        return 'Exemplos práticos são fundamentais para solidificar o aprendizado. Tente criar seus próprios exemplos baseados em situações reais de trabalho.';
    }

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

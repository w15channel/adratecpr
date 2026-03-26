// API de Chat para o Portal AD-RATEC PR
// Sistema de comunicação em tempo real entre estudantes e tutores

export default async function handler(req, res) {
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return handleGetMessages(req, res);
    }

    if (req.method === 'POST') {
        return handleSendMessage(req, res);
    }

    return res.status(405).json({ error: 'Método não permitido' });
}

// Armazenamento simulado de mensagens (em produção, usar banco de dados)
const messages = new Map();

async function handleGetMessages(req, res) {
    try {
        const { roomId, userId, limit = 50 } = req.query;

        if (!roomId) {
            return res.status(400).json({ error: 'ID da sala é obrigatório' });
        }

        const roomMessages = messages.get(roomId) || [];
        const userMessages = roomMessages.filter(msg => 
            !userId || msg.userId === userId || msg.type === 'system'
        );

        return res.status(200).json({
            success: true,
            messages: userMessages.slice(-limit),
            total: userMessages.length,
            roomId: roomId
        });

    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function handleSendMessage(req, res) {
    try {
        const { roomId, userId, userName, message, type = 'user' } = req.body;

        if (!roomId || !userId || !message) {
            return res.status(400).json({ 
                error: 'ID da sala, ID do usuário e mensagem são obrigatórios' 
            });
        }

        // Validar mensagem
        if (message.length > 1000) {
            return res.status(400).json({ error: 'Mensagem muito longa (máximo 1000 caracteres)' });
        }

        // Criar objeto de mensagem
        const messageObj = {
            id: generateMessageId(),
            roomId: roomId,
            userId: userId,
            userName: userName || 'Estudante',
            message: message.trim(),
            type: type,
            timestamp: new Date().toISOString(),
            reactions: [],
            edited: false,
            deleted: false
        };

        // Adicionar à sala
        if (!messages.has(roomId)) {
            messages.set(roomId, []);
        }
        messages.get(roomId).push(messageObj);

        // Limitar número de mensagens por sala
        const roomMessages = messages.get(roomId);
        if (roomMessages.length > 1000) {
            messages.set(roomId, roomMessages.slice(-1000));
        }

        // Gerar resposta automática se for mensagem de usuário
        let autoResponse = null;
        if (type === 'user') {
            autoResponse = await generateAutoResponse(messageObj, roomId);
            if (autoResponse) {
                messages.get(roomId).push(autoResponse);
            }
        }

        return res.status(201).json({
            success: true,
            message: messageObj,
            autoResponse: autoResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

function generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function generateAutoResponse(userMessage, roomId) {
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Respostas baseadas em padrões
    const message = userMessage.message.toLowerCase();
    
    // Saudações
    if (message.match(/^(oi|olá|bom dia|boa tarde|boa noite)/)) {
        return {
            id: generateMessageId(),
            roomId: roomId,
            userId: 'ia-tutor',
            userName: 'IA Tutor',
            message: generateGreetingResponse(),
            type: 'ia',
            timestamp: new Date().toISOString(),
            reactions: [],
            edited: false,
            deleted: false
        };
    }

    // Perguntas sobre conteúdo
    if (message.includes('dúvida') || message.includes('ajuda') || message.includes('não entendi')) {
        return {
            id: generateMessageId(),
            roomId: roomId,
            userId: 'ia-tutor',
            userName: 'IA Tutor',
            message: generateHelpResponse(message),
            type: 'ia',
            timestamp: new Date().toISOString(),
            reactions: [],
            edited: false,
            deleted: false
        };
    }

    // Perguntas sobre progresso
    if (message.includes('progresso') || message.includes('concluí') || message.includes('avançar')) {
        return {
            id: generateMessageId(),
            roomId: roomId,
            userId: 'ia-tutor',
            userName: 'IA Tutor',
            message: generateProgressResponse(),
            type: 'ia',
            timestamp: new Date().toISOString(),
            reactions: [],
            edited: false,
            deleted: false
        };
    }

    // Perguntas sobre módulos específicos
    const moduleKeywords = {
        'rh': 'Recursos Humanos',
        'finanças': 'Finanças Corporativas',
        'marketing': 'Marketing Digital',
        'programação': 'Programação & Tecnologia'
    };

    for (const [keyword, moduleName] of Object.entries(moduleKeywords)) {
        if (message.includes(keyword)) {
            return {
                id: generateMessageId(),
                roomId: roomId,
                userId: 'ia-tutor',
                userName: 'IA Tutor',
                message: generateModuleResponse(moduleName, message),
                type: 'ia',
                timestamp: new Date().toISOString(),
                reactions: [],
                edited: false,
                deleted: false
            };
        }
    }

    // Resposta padrão
    return {
        id: generateMessageId(),
        roomId: roomId,
        userId: 'ia-tutor',
        userName: 'IA Tutor',
        message: generateDefaultResponse(message),
        type: 'ia',
        timestamp: new Date().toISOString(),
        reactions: [],
        edited: false,
        deleted: false
    };
}

function generateGreetingResponse() {
    const greetings = [
        'Olá! Como posso ajudar com seus estudos hoje?',
        'Seja bem-vindo(a)! Estou aqui para apoiar seu aprendizado.',
        'Oi! Que ótimo ver você por aqui. Em que posso ajudar?',
        'Olá! Vamos juntos transformar seu futuro profissional.',
        'Seja bem-vindo(a) ao portal! Como posso auxiliar sua jornada?'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}

function generateHelpResponse(message) {
    return 'Entendo sua dúvida. Para melhor ajudá-lo(a), sugiro revisar os materiais da aula correspondente e tentar praticar com os exercícios propostos. Se a dúvida persistir, tente formular uma pergunta mais específica sobre o conceito que está com dificuldade.';
}

function generateProgressResponse() {
    return 'Seu progresso é acompanhado automaticamente pelo sistema. Continue concluindo as aulas e atividades para avançar. Lembre-se: a consistência é mais importante que a velocidade. Cada aula concluída o aproxima do seu objetivo!';
}

function generateModuleResponse(moduleName, message) {
    return `${moduleName} é um campo fascinante e essencial no mercado atual. O módulo foi desenhado para proporcionar conhecimento prático e aplicável. Recomendo focar nos exercícios práticos e tentar relacionar os conceitos com situações reais do mercado de trabalho.`;
}

function generateDefaultResponse(message) {
    const responses = [
        'Ótima pergunta! Continue explorando o conteúdo para aprofundar seu conhecimento.',
        'Essa é uma observação importante. Tente aplicar esses conceitos em situações práticas.',
        'Interessante ponto de vista! A diversidade de perspectivas enriquece o aprendizado.',
        'Para complementar seus estudos, sugiro revisar os materiais complementares do módulo.',
        'Continue com esse ritmo de dedicação. Seu esforço certamente trará ótimos resultados!',
        'Lembre-se: a prática constante é a chave para o domínio desses conceitos.',
        'Excelente iniciativa em buscar aprofundamento. Isso demonstra grande comprometimento com seu aprendizado.',
        'Tente conectar este conceito com outros módulos do curso para uma visão mais integrada.',
        'A aplicação prática do conhecimento é fundamental para o desenvolvimento profissional.',
        'Não hesite em perguntar sempre que surgir dúvidas. Estou aqui para ajudar!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

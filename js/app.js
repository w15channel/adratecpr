// AD-RATEC PR - Portal de Educação Profissional
// Sistema principal de gerenciamento de curso

// Estado global da aplicação
const AppState = {
    user: {
        name: 'Estudante',
        email: '',
        avatar: '🎯',
        points: 0,
        level: 1,
        completedLessons: [],
        currentModule: 0,
        startDate: new Date().toISOString(),
        lastAccess: new Date().toISOString()
    },
    progress: {
        total: 90,
        completed: 0,
        percentage: 0,
        currentDay: 1,
        streak: 0
    },
    modules: [
        {
            id: 'rh',
            title: 'Recursos Humanos',
            description: 'Gestão de pessoas, liderança e cultura organizacional',
            icon: '👥',
            color: '#3b82f6',
            days: 23,
            progress: 0,
            lessons: []
        },
        {
            id: 'financas',
            title: 'Finanças Corporativas',
            description: 'Análise financeira, investimentos e planejamento estratégico',
            icon: '📊',
            color: '#10b981',
            days: 22,
            progress: 0,
            lessons: []
        },
        {
            id: 'marketing',
            title: 'Marketing Digital',
            description: 'Estratégias de marketing, branding e crescimento',
            icon: '📱',
            color: '#a855f7',
            days: 23,
            progress: 0,
            lessons: []
        },
        {
            id: 'programacao',
            title: 'Programação & Tecnologia',
            description: 'Desenvolvimento de software, lógica e inovação',
            icon: '💻',
            color: '#f59e0b',
            days: 22,
            progress: 0,
            lessons: []
        }
    ],
    currentView: 'dashboard',
    isLoading: false
};

// Dados das aulas (simulados)
const generateLessons = (moduleId, days, subject) => {
    const lessons = [];
    const topics = {
        rh: [
            'Introdução à Gestão de Pessoas',
            'Recrutamento e Seleção',
            'Treinamento e Desenvolvimento',
            'Avaliação de Desempenho',
            'Compensação e Benefícios',
            'Legislação Trabalhista',
            'Cultura Organizacional',
            'Liderança e Motivação',
            'Comunicação Empresarial',
            'Gestão de Conflitos',
            'Saúde e Segurança no Trabalho',
            'Planejamento de RH',
            'Análise de Cargos',
            'Gestão por Competências',
            'Coaching e Mentoring',
            'Gestão de Mudanças',
            'Ética e Responsabilidade Social',
            'RH Digital',
            'Métricas de RH',
            'Gestão de Talentos',
            'Sucessão e Carreira',
            'Endomarketing',
            'Projeto Final de RH'
        ],
        financas: [
            'Fundamentos de Finanças',
            'Matemática Financeira',
            'Análise de Investimentos',
            'Orçamento Empresarial',
            'Fluxo de Caixa',
            'Análise de Balanços',
            'Custo de Capital',
            'Avaliação de Empresas',
            'Mercado Financeiro',
            'Risco e Retorno',
            'Derivativos',
            'Financiamento Corporativo',
            'Gestão de Tesouraria',
            'Controladoria',
            'Contabilidade Gerencial',
            'Planejamento Tributário',
            'Análise de Crédito',
            'Investimentos Sustentáveis',
            'Finanças Internacionais',
            'Fusões e Aquisições',
            'Gestão de Patrimônio',
            'Projeto Final de Finanças'
        ],
        marketing: [
            'Fundamentos de Marketing',
            'Comportamento do Consumidor',
            'Pesquisa de Mercado',
            'Planejamento Estratégico',
            'Marketing Digital',
            'Redes Sociais',
            'Content Marketing',
            'SEO e SEM',
            'Email Marketing',
            'Marketing de Influência',
            'Branding e Posicionamento',
            'Marketing de Conteúdo',
            'Análise de Dados',
            'Métricas e KPIs',
            'Marketing de Afiliados',
            'E-commerce',
            'Marketing Mobile',
            'Video Marketing',
            'Gestão de Campanhas',
            'Marketing de Relacionamento',
            'Neuromarketing',
            'Projeto Final de Marketing'
        ],
        programacao: [
            'Lógica de Programação',
            'Algoritmos e Estruturas',
            'Programação Orientada a Objetos',
            'Desenvolvimento Web',
            'Bancos de Dados',
            'APIs e Integrações',
            'Frontend Moderno',
            'Backend Development',
            'Cloud Computing',
            'DevOps e CI/CD',
            'Segurança da Informação',
            'Inteligência Artificial',
            'Machine Learning',
            'Data Science',
            'Blockchain',
            'Internet das Coisas',
            'Desenvolvimento Mobile',
            'Testes Automatizados',
            'Arquitetura de Software',
            'Metodologias Ágeis',
            'Versionamento de Código',
            'Projeto Final de Programação'
        ]
    };

    for (let i = 1; i <= days; i++) {
        lessons.push({
            id: `${moduleId}-lesson-${i}`,
            day: i,
            title: topics[moduleId][i - 1] || `Aula ${i}`,
            subject: moduleId.toUpperCase(),
            duration: Math.floor(Math.random() * 30) + 30, // 30-60 minutos
            type: i % 5 === 0 ? 'project' : 'lesson',
            completed: false,
            score: 0,
            content: {
                theory: `Conteúdo teórico da aula ${i} de ${subject}`,
                examples: ['Exemplo prático 1', 'Exemplo prático 2'],
                exercises: ['Exercício 1', 'Exercício 2'],
                quiz: []
            }
        });
    }
    return lessons;
};

// Inicializar aulas para cada módulo
AppState.modules.forEach(module => {
    module.lessons = generateLessons(module.id, module.days, module.title);
});

// Sistema de persistência
class StorageManager {
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    static load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return null;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover dados:', error);
            return false;
        }
    }
}

// Sistema de gerenciamento de usuário
class UserManager {
    static init() {
        const savedUser = StorageManager.load('adratecpr_user');
        if (savedUser) {
            AppState.user = { ...AppState.user, ...savedUser };
        }
        this.updateProgress();
        this.renderUserInfo();
    }

    static saveUser() {
        StorageManager.save('adratecpr_user', AppState.user);
    }

    static updateProgress() {
        const completedLessons = AppState.user.completedLessons.length;
        const totalLessons = AppState.modules.reduce((sum, module) => sum + module.lessons.length, 0);
        
        AppState.progress.completed = completedLessons;
        AppState.progress.total = totalLessons;
        AppState.progress.percentage = Math.round((completedLessons / totalLessons) * 100);
        
        // Calcular streak
        const today = new Date().toDateString();
        const lastAccess = new Date(AppState.user.lastAccess).toDateString();
        if (today !== lastAccess) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastAccess === yesterday) {
                AppState.progress.streak++;
            } else {
                AppState.progress.streak = 1;
            }
        }
        
        AppState.user.lastAccess = new Date().toISOString();
        this.saveUser();
    }

    static renderUserInfo() {
        const elements = {
            userName: document.getElementById('user-name-display'),
            userAvatar: document.getElementById('user-avatar'),
            userPoints: document.getElementById('user-points'),
            userLevel: document.getElementById('user-level'),
            userProgress: document.getElementById('user-progress'),
            userStreak: document.getElementById('user-streak')
        };

        if (elements.userName) {
            elements.userName.textContent = AppState.user.name;
        }
        
        if (elements.userAvatar) {
            elements.userAvatar.textContent = AppState.user.avatar;
        }
        
        if (elements.userPoints) {
            elements.userPoints.textContent = AppState.user.points;
        }
        
        if (elements.userLevel) {
            elements.userLevel.textContent = `Nível ${AppState.user.level}`;
        }
        
        if (elements.userProgress) {
            elements.userProgress.textContent = `${AppState.progress.completed}/${AppState.progress.total}`;
        }
        
        if (elements.userStreak) {
            elements.userStreak.textContent = `${AppState.progress.streak} dias`;
        }
    }

    static completeLesson(lessonId, score = 100) {
        if (!AppState.user.completedLessons.includes(lessonId)) {
            AppState.user.completedLessons.push(lessonId);
            AppState.user.points += Math.floor(score / 10);
            
            // Atualizar nível
            const newLevel = Math.floor(AppState.user.points / 100) + 1;
            if (newLevel > AppState.user.level) {
                AppState.user.level = newLevel;
                this.showLevelUpNotification();
            }
            
            this.updateProgress();
            this.renderUserInfo();
            this.saveUser();
        }
    }

    static showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn';
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-2xl">🎉</span>
                <div>
                    <div class="font-bold">Parabéns!</div>
                    <div class="text-sm">Você alcançou o nível ${AppState.user.level}!</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Sistema de navegação
class NavigationManager {
    static showView(viewId) {
        // Esconder todas as views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });
        
        // Mostrar view selecionada
        const selectedView = document.getElementById(viewId);
        if (selectedView) {
            selectedView.classList.remove('hidden');
        }
        
        AppState.currentView = viewId;
        this.updateNavigation();
    }

    static updateNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === AppState.currentView) {
                link.classList.add('active');
            }
        });
    }

    static init() {
        // Configurar links de navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const viewId = link.dataset.view;
                this.showView(viewId);
            });
        });
    }
}

// Sistema de renderização de módulos
class ModuleRenderer {
    static renderModules() {
        const container = document.getElementById('modules-grid');
        if (!container) return;

        container.innerHTML = AppState.modules.map(module => `
            <div class="module-card" onclick="ModuleRenderer.showModule('${module.id}')">
                <div class="module-icon" style="background: ${module.color}">
                    ${module.icon}
                </div>
                <h3 class="module-title">${module.title}</h3>
                <p class="module-description">${module.description}</p>
                <div class="module-stats">
                    <span>${module.days} aulas</span>
                    <span>${module.progress}% concluído</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${module.progress}%"></div>
                </div>
            </div>
        `).join('');
    }

    static showModule(moduleId) {
        const module = AppState.modules.find(m => m.id === moduleId);
        if (!module) return;

        AppState.user.currentModule = moduleId;
        UserManager.saveUser();
        
        // Renderizar view do módulo
        this.renderModuleView(module);
        NavigationManager.showView('module-view');
    }

    static renderModuleView(module) {
        const container = document.getElementById('module-content');
        if (!container) return;

        container.innerHTML = `
            <div class="module-header">
                <button onclick="NavigationManager.showView('dashboard')" class="btn btn-secondary">
                    ← Voltar
                </button>
                <div>
                    <h2>${module.title}</h2>
                    <p>${module.description}</p>
                </div>
                <div class="progress-circle">${module.progress}%</div>
            </div>
            <div class="lessons-grid">
                ${module.lessons.map(lesson => `
                    <div class="lesson-card ${lesson.completed ? 'completed' : ''}" 
                         onclick="LessonRenderer.showLesson('${lesson.id}')">
                        <div class="lesson-number">Dia ${lesson.day}</div>
                        <h4 class="lesson-title">${lesson.title}</h4>
                        <div class="lesson-duration">${lesson.duration} min</div>
                        ${lesson.type === 'project' ? '<span class="project-badge">Projeto</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Sistema de renderização de aulas
class LessonRenderer {
    static showLesson(lessonId) {
        // Encontrar aula em todos os módulos
        let lesson = null;
        let module = null;
        
        for (const m of AppState.modules) {
            const found = m.lessons.find(l => l.id === lessonId);
            if (found) {
                lesson = found;
                module = m;
                break;
            }
        }
        
        if (!lesson) return;

        this.renderLessonModal(lesson, module);
    }

    static renderLessonModal(lesson, module) {
        const modal = document.getElementById('lesson-modal');
        if (!modal) return;

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <span class="lesson-number">Dia ${lesson.day}</span>
                        <h2>${lesson.title}</h2>
                    </div>
                    <button onclick="LessonRenderer.closeLessonModal()" class="btn btn-secondary">✕</button>
                </div>
                <div class="modal-body">
                    <div class="lesson-content">
                        <div class="content-section">
                            <h3>📚 Conteúdo Teórico</h3>
                            <p>${lesson.content.theory}</p>
                        </div>
                        
                        <div class="content-section">
                            <h3>💡 Exemplos Práticos</h3>
                            <ul>
                                ${lesson.content.examples.map(example => `<li>${example}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="content-section">
                            <h3>✏️ Exercícios</h3>
                            <ol>
                                ${lesson.content.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
                            </ol>
                        </div>
                        
                        <div class="content-section">
                            <h3>📝 Atividade Prática</h3>
                            <textarea class="form-textarea" placeholder="Desenvolva sua atividade prática aqui..." rows="6"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="LessonRenderer.completeLesson('${lesson.id}')" class="btn btn-primary">
                        Concluir Aula (+${Math.floor(100/10)} pontos)
                    </button>
                    <button onclick="LessonRenderer.closeLessonModal()" class="btn btn-secondary">
                        Fechar
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    static completeLesson(lessonId) {
        UserManager.completeLesson(lessonId);
        this.closeLessonModal();
        
        // Atualizar renderização
        ModuleRenderer.renderModules();
        if (AppState.currentView === 'module-view') {
            const module = AppState.modules.find(m => m.id === AppState.user.currentModule);
            ModuleRenderer.renderModuleView(module);
        }
    }

    static closeLessonModal() {
        const modal = document.getElementById('lesson-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// Sistema de dashboard
class DashboardRenderer {
    static render() {
        this.renderStats();
        this.renderRecentActivity();
        this.renderNextLessons();
    }

    static renderStats() {
        const statsContainer = document.getElementById('stats-grid');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${AppState.progress.percentage}%</div>
                <div class="stat-label">Progresso Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${AppState.user.points}</div>
                <div class="stat-label">Pontos Acumulados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${AppState.progress.streak}</div>
                <div class="stat-label">Dias Consecutivos</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${AppState.user.level}</div>
                <div class="stat-label">Nível Atual</div>
            </div>
        `;
    }

    static renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        // Simular atividades recentes
        const activities = [
            { type: 'lesson', title: 'Introdução à Gestão de Pessoas', time: '2 horas atrás' },
            { type: 'achievement', title: 'Nível 2 alcançado', time: '1 dia atrás' },
            { type: 'lesson', title: 'Fundamentos de Finanças', time: '2 dias atrás' }
        ];

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span class="activity-icon">${activity.type === 'lesson' ? '📚' : '🏆'}</span>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    static renderNextLessons() {
        const container = document.getElementById('next-lessons');
        if (!container) return;

        // Encontrar próximas aulas não concluídas
        const nextLessons = [];
        for (const module of AppState.modules) {
            const nextLesson = module.lessons.find(lesson => !lesson.completed);
            if (nextLesson) {
                nextLessons.push({
                    ...nextLesson,
                    moduleTitle: module.title,
                    moduleColor: module.color
                });
            }
        }

        container.innerHTML = nextLessons.slice(0, 3).map(lesson => `
            <div class="next-lesson-card" onclick="LessonRenderer.showLesson('${lesson.id}')">
                <div class="lesson-module" style="background: ${lesson.moduleColor}">
                    ${lesson.moduleTitle}
                </div>
                <div class="lesson-info">
                    <h4>${lesson.title}</h4>
                    <p>Dia ${lesson.day} • ${lesson.duration} min</p>
                </div>
            </div>
        `).join('');
    }
}

// Sistema de IA Tutor
class IATutor {
    static open() {
        const modal = document.getElementById('ia-tutor-modal');
        if (!modal) return;

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🤖 IA Tutor</h2>
                    <button onclick="IATutor.close()" class="btn btn-secondary">✕</button>
                </div>
                <div class="modal-body">
                    <div class="chat-container">
                        <div class="chat-messages" id="ia-chat-messages">
                            <div class="message ai-message">
                                Olá! Sou seu tutor de IA. Como posso ajudar com seus estudos hoje?
                            </div>
                        </div>
                        <div class="chat-input-container">
                            <input type="text" id="ia-chat-input" placeholder="Digite sua pergunta..." class="form-input">
                            <button onclick="IATutor.sendMessage()" class="btn btn-primary">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        
        // Focar no input
        setTimeout(() => {
            const input = document.getElementById('ia-chat-input');
            if (input) input.focus();
        }, 100);
    }

    static sendMessage() {
        const input = document.getElementById('ia-chat-input');
        const messagesContainer = document.getElementById('ia-chat-messages');
        
        if (!input || !messagesContainer || !input.value.trim()) return;

        const userMessage = input.value.trim();
        input.value = '';

        // Adicionar mensagem do usuário
        const userMsgElement = document.createElement('div');
        userMsgElement.className = 'message user-message';
        userMsgElement.textContent = userMessage;
        messagesContainer.appendChild(userMsgElement);

        // Simular resposta da IA
        setTimeout(() => {
            const aiMsgElement = document.createElement('div');
            aiMsgElement.className = 'message ai-message';
            aiMsgElement.textContent = this.generateAIResponse(userMessage);
            messagesContainer.appendChild(aiMsgElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    static generateAIResponse(message) {
        // Respostas simuladas baseadas em palavras-chave
        const responses = {
            'rh': 'Recursos Humanos é fundamental para o sucesso empresarial. Foco em gestão de pessoas e cultura organizacional.',
            'finanças': 'Finanças corporativas envolvem análise de investimentos, planejamento e controle financeiro.',
            'marketing': 'Marketing digital é essencial nos dias atuais. Estude SEO, redes sociais e conteúdo.',
            'programação': 'Programação desenvolve lógica e resolução de problemas. Comece com algoritmos e estruturas.'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return 'Ótima pergunta! Continue estudando e praticando. A consistência é a chave para o sucesso profissional.';
    }

    static close() {
        const modal = document.getElementById('ia-tutor-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// Inicialização da aplicação
class App {
    static init() {
        // Inicializar sistemas
        UserManager.init();
        NavigationManager.init();
        
        // Renderizar conteúdo inicial
        ModuleRenderer.renderModules();
        DashboardRenderer.render();
        
        // Mostrar dashboard inicialmente
        NavigationManager.showView('dashboard');
        
        // Configurar eventos globais
        this.setupGlobalEvents();
        
        console.log('🚀 AD-RATEC PR inicializado com sucesso!');
    }

    static setupGlobalEvents() {
        // Event listener para input do chat IA
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.id === 'ia-chat-input') {
                IATutor.sendMessage();
            }
        });

        // Event listener para fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Exportar para uso global
window.App = App;
window.UserManager = UserManager;
window.NavigationManager = NavigationManager;
window.ModuleRenderer = ModuleRenderer;
window.LessonRenderer = LessonRenderer;
window.IATutor = IATutor;
window.AppState = AppState;

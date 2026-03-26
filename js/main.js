// ADRA-TEC - Portal de Educação Profissional
// Sistema principal simplificado e funcional

// Estado global
const AppState = {
    user: {
        name: 'Estudante',
        avatar: '🎯',
        points: 0,
        level: 1,
        completedLessons: [],
        streak: 0
    },
    modules: [
        {
            id: 'rh',
            title: 'Recursos Humanos',
            description: 'Gestão de pessoas, liderança e cultura organizacional',
            icon: '👥',
            color: '#3b82f6',
            progress: 0
        },
        {
            id: 'financas',
            title: 'Finanças Corporativas',
            description: 'Análise financeira, investimentos e planejamento estratégico',
            icon: '📊',
            color: '#10b981',
            progress: 0
        },
        {
            id: 'marketing',
            title: 'Marketing Digital',
            description: 'Estratégias de marketing, branding e crescimento',
            icon: '📱',
            color: '#a855f7',
            progress: 0
        },
        {
            id: 'programacao',
            title: 'Programação & Tecnologia',
            description: 'Desenvolvimento de software, lógica e inovação',
            icon: '💻',
            color: '#f59e0b',
            progress: 0
        }
    ]
};

// Sistema de navegação
class NavigationManager {
    static showView(viewId) {
        // Esconder todas as views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });
        
        // Mostrar view selecionada
        const selectedView = document.getElementById(`${viewId}-view`);
        if (selectedView) {
            selectedView.classList.remove('hidden');
        }
        
        // Atualizar navegação ativa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === viewId) {
                link.classList.add('active');
            }
        });
    }
}

// Sistema de gerenciamento de usuário
class UserManager {
    static loadUser() {
        const savedUser = localStorage.getItem('adra-tec_user');
        if (savedUser) {
            AppState.user = { ...AppState.user, ...JSON.parse(savedUser) };
        }
        this.updateUI();
    }

    static saveUser() {
        localStorage.setItem('adra-tec_user', JSON.stringify(AppState.user));
    }

    static updateUI() {
        const elements = {
            userName: document.getElementById('header-name'),
            userAvatar: document.getElementById('header-avatar'),
            userPoints: document.getElementById('header-points')
        };

        if (elements.userName) {
            elements.userName.textContent = AppState.user.name;
        }
        if (elements.userAvatar) {
            elements.userAvatar.textContent = AppState.user.avatar;
        }
        if (elements.userPoints) {
            elements.userPoints.textContent = `${AppState.user.points} pts`;
        }
    }

    static showProfile() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            document.getElementById('profile-name').value = AppState.user.name;
            modal.classList.add('active');
        }
    }

    static closeProfile() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    static saveProfile() {
        const nameInput = document.getElementById('profile-name');
        if (nameInput) {
            AppState.user.name = nameInput.value || 'Estudante';
            this.saveUser();
            this.updateUI();
            this.closeProfile();
        }
    }

    static selectAvatar(avatar) {
        AppState.user.avatar = avatar;
        this.saveUser();
        this.updateUI();
    }

    static showSettings() {
        alert('Configurações em desenvolvimento...');
    }

    static logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('adra-tec_user');
            location.reload();
        }
    }
}

// Sistema de IA Tutor
class IATutor {
    static open() {
        const modal = document.getElementById('ia-tutor-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    static close() {
        const modal = document.getElementById('ia-tutor-modal');
        if (modal) {
            modal.classList.remove('active');
        }
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
            aiMsgElement.textContent = this.generateResponse(userMessage);
            messagesContainer.appendChild(aiMsgElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    static generateResponse(message) {
        const responses = [
            'Ótima pergunta! Continue explorando o conteúdo para aprofundar seu conhecimento.',
            'Para melhor entendimento, revise os materiais complementares disponíveis no módulo.',
            'Pratique com os exercícios propostos para fixar o aprendizado.',
            'Tente relacionar este conceito com situações reais do mercado de trabalho.',
            'A consistência nos estudos é fundamental para o domínio destes conteúdos.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Sistema de Dashboard
class DashboardRenderer {
    static render() {
        const dashboardView = document.getElementById('dashboard-view');
        if (!dashboardView) return;

        dashboardView.innerHTML = `
            <div class="dashboard">
                <main class="main-content">
                    <section class="welcome-section">
                        <div class="welcome-content">
                            <h1>Bem-vindo(a) ao ADRA-TEC</h1>
                            <p>Transforme sua carreira com nossa plataforma profissional de educação</p>
                            <div class="welcome-actions">
                                <button class="btn btn-primary" onclick="NavigationManager.showView('modules')">
                                    <i class="fas fa-rocket"></i>
                                    Explorar Módulos
                                </button>
                                <button class="btn btn-secondary" onclick="NavigationManager.showView('progress')">
                                    <i class="fas fa-chart-line"></i>
                                    Ver Progresso
                                </button>
                            </div>
                        </div>
                    </section>

                    <section class="quick-stats">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">${AppState.user.completedLessons.length}</div>
                                    <div class="stat-label">Aulas Concluídas</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-fire"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">${AppState.user.streak}</div>
                                    <div class="stat-label">Dias Consecutivos</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">${AppState.user.points}</div>
                                    <div class="stat-label">Pontos Acumulados</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">${AppState.user.level}</div>
                                    <div class="stat-label">Nível Atual</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="modules-overview">
                        <h2>Módulos Disponíveis</h2>
                        <div class="modules-grid">
                            ${AppState.modules.map(module => `
                                <div class="module-card" onclick="NavigationManager.showView('modules')">
                                    <div class="module-icon" style="background: ${module.color}">
                                        ${module.icon}
                                    </div>
                                    <h3>${module.title}</h3>
                                    <p>${module.description}</p>
                                    <div class="module-stats">
                                        <span>Progresso: ${module.progress}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${module.progress}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                </main>
            </div>
        `;
    }
}

// Sistema de Módulos
class ModulesRenderer {
    static render() {
        const modulesView = document.getElementById('modules-view');
        if (!modulesView) return;

        modulesView.innerHTML = `
            <div class="modules-view">
                <div class="modules-header">
                    <h1>Módulos de Formação</h1>
                    <p>Domine as quatro áreas essenciais para o sucesso profissional</p>
                </div>

                <div class="modules-grid">
                    ${AppState.modules.map(module => `
                        <div class="module-card" onclick="ModulesRenderer.showModule('${module.id}')">
                            <div class="module-header">
                                <div class="module-icon" style="background: ${module.color}">
                                    ${module.icon}
                                </div>
                                <div class="module-info">
                                    <h3>${module.title}</h3>
                                    <div class="module-meta">
                                        <span class="difficulty">Intermediário</span>
                                        <span class="duration">90 dias</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="module-content">
                                <p>${module.description}</p>
                                
                                <div class="module-actions">
                                    <button class="btn btn-primary">
                                        <i class="fas fa-play"></i>
                                        ${module.progress > 0 ? 'Continuar' : 'Começar'}
                                    </button>
                                    <button class="btn btn-secondary">
                                        <i class="fas fa-info-circle"></i>
                                        Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    static showModule(moduleId) {
        const module = AppState.modules.find(m => m.id === moduleId);
        if (!module) return;
        
        alert(`Módulo: ${module.title}\n\nEm desenvolvimento...`);
    }
}

// Sistema de Progresso
class ProgressRenderer {
    static render() {
        const progressView = document.getElementById('progress-view');
        if (!progressView) return;

        progressView.innerHTML = `
            <div class="progress-dashboard">
                <h1>Seu Progresso</h1>
                <div class="progress-overview">
                    <div class="progress-stats">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">${Math.round((AppState.user.completedLessons.length / 90) * 100)}%</div>
                                <div class="stat-label">Progresso Total</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">${AppState.user.completedLessons.length}</div>
                                <div class="stat-label">Aulas Concluídas</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-fire"></i>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">${AppState.user.streak}</div>
                                <div class="stat-label">Dias Consecutivos</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">${AppState.user.points}</div>
                                <div class="stat-label">Pontos Totais</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modules-progress">
                    <h2>Progresso por Módulo</h2>
                    <div class="module-progress-list">
                        ${AppState.modules.map(module => `
                            <div class="module-progress-item">
                                <div class="module-info">
                                    <span class="module-icon">${module.icon}</span>
                                    <span class="module-name">${module.title}</span>
                                </div>
                                <div class="module-progress-bar">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${module.progress}%"></div>
                                    </div>
                                    <span class="progress-text">${module.progress}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

// Sistema de Comunidade
class CommunityRenderer {
    static render() {
        const communityView = document.getElementById('community-view');
        if (!communityView) return;

        communityView.innerHTML = `
            <div class="community-dashboard">
                <h1>Comunidade ADRA-TEC</h1>
                
                <div class="community-content">
                    <div class="community-sidebar">
                        <div class="community-card">
                            <h3>Ranking Semanal</h3>
                            <div class="ranking-list">
                                <div class="ranking-item">
                                    <span class="rank">1</span>
                                    <span class="name">Você</span>
                                    <span class="points">${AppState.user.points} pts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="community-main">
                        <div class="community-card">
                            <h3>Feed da Comunidade</h3>
                            <div class="community-feed">
                                <div class="feed-item">
                                    <span class="feed-icon">🎉</span>
                                    <div class="feed-content">
                                        <div class="feed-title">Bem-vindo à ADRA-TEC!</div>
                                        <div class="feed-time">Agora</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Inicialização da aplicação
class App {
    static init() {
        // Carregar dados do usuário
        UserManager.loadUser();
        
        // Renderizar conteúdo inicial
        DashboardRenderer.render();
        ModulesRenderer.render();
        ProgressRenderer.render();
        CommunityRenderer.render();
        
        // Configurar eventos globais
        this.setupGlobalEvents();
        
        // Mostrar dashboard inicialmente
        NavigationManager.showView('dashboard');
        
        console.log('🚀 ADRA-TEC inicializado com sucesso!');
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

        // Event listener para fechar modais clicando fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }
}

// Tornar classes globais
window.NavigationManager = NavigationManager;
window.UserManager = UserManager;
window.IATutor = IATutor;
window.DashboardRenderer = DashboardRenderer;
window.ModulesRenderer = ModulesRenderer;
window.ProgressRenderer = ProgressRenderer;
window.CommunityRenderer = CommunityRenderer;
window.App = App;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

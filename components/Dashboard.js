// Componente Dashboard para AD-RATEC PR
export class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.stats = {};
        this.init();
    }

    init() {
        this.render();
        this.loadStats();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="dashboard">
                <main class="main-content">
                    <section class="welcome-section">
                        <div class="welcome-content">
                            <h1>Bem-vindo(a) ao seu futuro profissional</h1>
                            <p>Transforme sua carreira em 90 dias com nosso programa intensivo de formação</p>
                            <div class="welcome-actions">
                                <button class="btn btn-primary" onclick="NavigationManager.showView('modules')">
                                    <i class="fas fa-rocket"></i>
                                    Começar Agora
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
                                    <div class="stat-value" id="stat-progress">0%</div>
                                    <div class="stat-label">Progresso Total</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-fire"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="stat-streak">0</div>
                                    <div class="stat-label">Dias Consecutivos</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="stat-points">0</div>
                                    <div class="stat-label">Pontos Acumulados</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="stat-level">1</div>
                                    <div class="stat-label">Nível Atual</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="modules-overview">
                        <h2>Módulos Disponíveis</h2>
                        <div class="modules-grid" id="dashboard-modules">
                            <!-- Módulos serão renderizados dinamicamente -->
                        </div>
                    </section>

                    <section class="recent-activity">
                        <h2>Atividade Recente</h2>
                        <div class="activity-list" id="recent-activity">
                            <!-- Atividades serão renderizadas dinamicamente -->
                        </div>
                    </section>

                    <section class="next-lessons">
                        <h2>Próximas Aulas</h2>
                        <div class="lessons-list" id="next-lessons">
                            <!-- Próximas aulas serão renderizadas dinamicamente -->
                        </div>
                    </section>
                </main>

                <aside class="sidebar">
                    <div class="sidebar-card">
                        <h3>Meta Diária</h3>
                        <div class="daily-goal">
                            <div class="goal-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="daily-progress" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="goal-text">
                                <span id="daily-completed">0</span> / <span id="daily-goal">2</span> aulas
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-card">
                        <h3>Conquistas Recentes</h3>
                        <div class="achievements-list">
                            <div class="achievement">
                                <div class="achievement-icon">🎯</div>
                                <div class="achievement-info">
                                    <div class="achievement-title">Primeiros Passos</div>
                                    <div class="achievement-desc">Complete sua primeira aula</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-card">
                        <h3>Ranking Semanal</h3>
                        <div class="ranking-list">
                            <div class="ranking-item">
                                <span class="rank">1</span>
                                <span class="name">Você</span>
                                <span class="points">0 pts</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        `;
    }

    setupEventListeners() {
        // Event listeners para interações do dashboard
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.stat-card')) {
                this.handleStatClick(e.target.closest('.stat-card'));
            }
        });
    }

    loadStats() {
        const savedUser = localStorage.getItem('adratecpr_user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            this.updateStats(user);
        }
    }

    updateStats(user) {
        // Atualizar estatísticas
        const progress = user.completedLessons ? (user.completedLessons.length / 90 * 100) : 0;
        const streak = user.streak || 0;
        const points = user.points || 0;
        const level = Math.floor(points / 100) + 1;

        this.updateElement('stat-progress', `${Math.round(progress)}%`);
        this.updateElement('stat-streak', streak);
        this.updateElement('stat-points', points);
        this.updateElement('stat-level', level);

        // Atualizar meta diária
        const dailyCompleted = user.dailyCompleted || 0;
        const dailyGoal = user.dailyGoal || 2;
        const dailyProgress = (dailyCompleted / dailyGoal) * 100;

        this.updateElement('daily-completed', dailyCompleted);
        this.updateElement('daily-goal', dailyGoal);
        
        const dailyProgressBar = this.container.querySelector('#daily-progress');
        if (dailyProgressBar) {
            dailyProgressBar.style.width = `${Math.min(dailyProgress, 100)}%`;
        }
    }

    updateElement(id, value) {
        const element = this.container.querySelector(`#${id}`);
        if (element) {
            element.textContent = value;
        }
    }

    renderModules() {
        const modulesContainer = this.container.querySelector('#dashboard-modules');
        if (!modulesContainer) return;

        const modules = [
            {
                id: 'rh',
                title: 'Recursos Humanos',
                description: 'Gestão de pessoas e cultura organizacional',
                icon: '👥',
                color: '#3b82f6',
                progress: 0,
                lessons: 23
            },
            {
                id: 'financas',
                title: 'Finanças Corporativas',
                description: 'Análise financeira e investimentos',
                icon: '📊',
                color: '#10b981',
                progress: 0,
                lessons: 22
            },
            {
                id: 'marketing',
                title: 'Marketing Digital',
                description: 'Estratégias de marketing e branding',
                icon: '📱',
                color: '#a855f7',
                progress: 0,
                lessons: 23
            },
            {
                id: 'programacao',
                title: 'Programação & Tecnologia',
                description: 'Desenvolvimento de software e inovação',
                icon: '💻',
                color: '#f59e0b',
                progress: 0,
                lessons: 22
            }
        ];

        modulesContainer.innerHTML = modules.map(module => `
            <div class="module-card" onclick="ModuleRenderer.showModule('${module.id}')">
                <div class="module-icon" style="background: ${module.color}">
                    ${module.icon}
                </div>
                <h3>${module.title}</h3>
                <p>${module.description}</p>
                <div class="module-stats">
                    <span>${module.lessons} aulas</span>
                    <span>${module.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${module.progress}%"></div>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivity() {
        const activityContainer = this.container.querySelector('#recent-activity');
        if (!activityContainer) return;

        const activities = [
            {
                type: 'lesson',
                title: 'Introdução à Gestão de Pessoas',
                time: '2 horas atrás',
                icon: '📚'
            },
            {
                type: 'achievement',
                title: 'Meta diária alcançada',
                time: '1 dia atrás',
                icon: '🏆'
            },
            {
                type: 'milestone',
                title: 'Nível 2 desbloqueado',
                time: '2 dias atrás',
                icon: '⭐'
            }
        ];

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    renderNextLessons() {
        const lessonsContainer = this.container.querySelector('#next-lessons');
        if (!lessonsContainer) return;

        const nextLessons = [
            {
                module: 'RH',
                title: 'Recrutamento e Seleção',
                day: 'Dia 2',
                duration: '45 min',
                color: '#3b82f6'
            },
            {
                module: 'Finanças',
                title: 'Fundamentos de Investimentos',
                day: 'Dia 24',
                duration: '60 min',
                color: '#10b981'
            },
            {
                module: 'Marketing',
                title: 'Introdução ao Marketing Digital',
                day: 'Dia 46',
                duration: '50 min',
                color: '#a855f7'
            }
        ];

        lessonsContainer.innerHTML = nextLessons.map(lesson => `
            <div class="next-lesson-card">
                <div class="lesson-module" style="background: ${lesson.color}">
                    ${lesson.module}
                </div>
                <div class="lesson-info">
                    <h4>${lesson.title}</h4>
                    <p>${lesson.day} • ${lesson.duration}</p>
                </div>
                <button class="btn btn-sm btn-primary">
                    Começar
                </button>
            </div>
        `).join('');
    }

    handleStatClick(statCard) {
        const statType = statCard.querySelector('.stat-label').textContent;
        console.log(`Stat clicked: ${statType}`);
        // Implementar ação baseada no tipo de estatística
    }

    refresh() {
        this.loadStats();
        this.renderModules();
        this.renderRecentActivity();
        this.renderNextLessons();
    }
}

// Componente Modules para AD-RATEC PR
export class Modules {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentModule = null;
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="modules-view">
                <div class="modules-header">
                    <h1>Módulos de Formação</h1>
                    <p>Domine as quatro áreas essenciais para o sucesso profissional</p>
                </div>

                <div class="modules-grid" id="modules-container">
                    <!-- Módulos serão renderizados dinamicamente -->
                </div>

                <div class="module-details" id="module-details">
                    <!-- Detalhes do módulo serão renderizados dinamicamente -->
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Event listeners para interações dos módulos
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.module-card')) {
                const moduleId = e.target.closest('.module-card').dataset.module;
                this.showModuleDetails(moduleId);
            }
        });
    }

    renderModules() {
        const modulesContainer = this.container.querySelector('#modules-container');
        if (!modulesContainer) return;

        const modules = [
            {
                id: 'rh',
                title: 'Recursos Humanos',
                description: 'Aprenda a gerir talentos, desenvolver liderança e construir cultura organizacional forte.',
                icon: '👥',
                color: '#3b82f6',
                days: 23,
                lessons: 23,
                difficulty: 'Intermediário',
                prerequisites: 'Nenhum',
                skills: [
                    'Recrutamento e Seleção',
                    'Treinamento e Desenvolvimento',
                    'Gestão de Desempenho',
                    'Cultura Organizacional',
                    'Liderança e Motivação'
                ],
                career: ['Analista de RH', 'Gerente de Pessoas', 'Head de RH', 'Consultor de RH'],
                salary: 'R$ 3.000 - R$ 15.000',
                progress: 0
            },
            {
                id: 'financas',
                title: 'Finanças Corporativas',
                description: 'Domine análise financeira, investimentos e planejamento estratégico para empresas.',
                icon: '📊',
                color: '#10b981',
                days: 22,
                lessons: 22,
                difficulty: 'Avançado',
                prerequisites: 'Matemática Básica',
                skills: [
                    'Análise Financeira',
                    'Orçamento Empresarial',
                    'Investimentos',
                    'Fluxo de Caixa',
                    'Planejamento Tributário'
                ],
                career: ['Analista Financeiro', 'Controller', 'CFO', 'Consultor Financeiro'],
                salary: 'R$ 4.000 - R$ 20.000',
                progress: 0
            },
            {
                id: 'marketing',
                title: 'Marketing Digital',
                description: 'Conquiste o mercado digital com estratégias de marketing, branding e crescimento.',
                icon: '📱',
                color: '#a855f7',
                days: 23,
                lessons: 23,
                difficulty: 'Intermediário',
                prerequisites: 'Conhecimento básico de internet',
                skills: [
                    'Marketing de Conteúdo',
                    'SEO e SEM',
                    'Redes Sociais',
                    'Email Marketing',
                    'Análise de Dados'
                ],
                career: ['Analista de Marketing', 'Gerente de Marketing', 'Head de Marketing', 'Consultor Digital'],
                salary: 'R$ 3.000 - R$ 18.000',
                progress: 0
            },
            {
                id: 'programacao',
                title: 'Programação & Tecnologia',
                description: 'Desenvolva habilidades em programação, lógica e tecnologias inovadoras.',
                icon: '💻',
                color: '#f59e0b',
                days: 22,
                lessons: 22,
                difficulty: 'Intermediário',
                prerequisites: 'Lógica de programação',
                skills: [
                    'Desenvolvimento Web',
                    'Bancos de Dados',
                    'APIs',
                    'Cloud Computing',
                    'Inteligência Artificial'
                ],
                career: ['Desenvolvedor', 'Engenheiro de Software', 'Arquiteto de Software', 'CTO'],
                salary: 'R$ 5.000 - R$ 25.000',
                progress: 0
            }
        ];

        modulesContainer.innerHTML = modules.map(module => `
            <div class="module-card" data-module="${module.id}">
                <div class="module-header">
                    <div class="module-icon" style="background: ${module.color}">
                        ${module.icon}
                    </div>
                    <div class="module-info">
                        <h3>${module.title}</h3>
                        <div class="module-meta">
                            <span class="difficulty difficulty-${module.difficulty.toLowerCase()}">
                                ${module.difficulty}
                            </span>
                            <span class="duration">${module.days} dias</span>
                        </div>
                    </div>
                </div>
                
                <div class="module-content">
                    <p>${module.description}</p>
                    
                    <div class="module-stats">
                        <div class="stat">
                            <i class="fas fa-book"></i>
                            <span>${module.lessons} aulas</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <span>${module.days} dias</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-chart-line"></i>
                            <span>${module.progress}%</span>
                        </div>
                    </div>

                    <div class="module-skills">
                        <h4>Habilidades que você desenvolverá:</h4>
                        <div class="skills-list">
                            ${module.skills.slice(0, 3).map(skill => `
                                <span class="skill-tag">${skill}</span>
                            `).join('')}
                            ${module.skills.length > 3 ? `<span class="skill-more">+${module.skills.length - 3}</span>` : ''}
                        </div>
                    </div>

                    <div class="module-outcome">
                        <div class="outcome-info">
                            <div class="outcome-item">
                                <i class="fas fa-briefcase"></i>
                                <div>
                                    <div class="outcome-label">Carreiras</div>
                                    <div class="outcome-value">${module.career[0]}</div>
                                </div>
                            </div>
                            <div class="outcome-item">
                                <i class="fas fa-dollar-sign"></i>
                                <div>
                                    <div class="outcome-label">Faixa Salarial</div>
                                    <div class="outcome-value">${module.salary}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="module-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${module.progress}%"></div>
                        </div>
                        <span class="progress-text">${module.progress}% concluído</span>
                    </div>

                    <div class="module-actions">
                        <button class="btn btn-primary" onclick="ModuleRenderer.startModule('${module.id}')">
                            <i class="fas fa-play"></i>
                            ${module.progress > 0 ? 'Continuar' : 'Começar'}
                        </button>
                        <button class="btn btn-secondary" onclick="Modules.showModuleDetails('${module.id}')">
                            <i class="fas fa-info-circle"></i>
                            Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showModuleDetails(moduleId) {
        const modules = {
            rh: {
                title: 'Recursos Humanos',
                description: 'O módulo de Recursos Humanos foi desenhado para formar profissionais capazes de gerir o capital humano das organizações de forma estratégica e eficaz.',
                objectives: [
                    'Dominar processos de recrutamento e seleção',
                    'Desenvolver programas de treinamento eficazes',
                    'Implementar sistemas de gestão de desempenho',
                    'Construir cultura organizacional positiva',
                    'Liderar equipes de alta performance'
                ],
                methodology: 'Aulas teóricas, estudos de caso, simulações e projetos práticos',
                certification: 'Certificado de Especialista em Gestão de Pessoas',
                investment: 'R$ 997,00 à vista ou 12x de R$ 97,00'
            },
            financas: {
                title: 'Finanças Corporativas',
                description: 'Este módulo prepara profissionais para analisar, planejar e controlar recursos financeiros em organizações de diversos portes.',
                objectives: [
                    'Analisar demonstrativos financeiros',
                    'Elaborar orçamentos empresariais',
                    'Avaliar investimentos e projetos',
                    'Gerenciar fluxo de caixa',
                    'Planejar estratégias financeiras'
                ],
                methodology: 'Modelos financeiros, planilhas, simulações de mercado e projetos reais',
                certification: 'Certificado de Especialista em Finanças Corporativas',
                investment: 'R$ 1.197,00 à vista ou 12x de R$ 117,00'
            },
            marketing: {
                title: 'Marketing Digital',
                description: 'Formação completa em marketing digital, desde estratégias até execução e análise de resultados.',
                objectives: [
                    'Desenvolver estratégias de marketing digital',
                    'Dominar SEO, SEM e mídias sociais',
                    'Criar conteúdo de alta performance',
                    'Analisar métricas e KPIs',
                    'Construir marcas fortes'
                ],
                methodology: 'Aulas práticas, criação de campanhas reais, estudos de caso e ferramentas digitais',
                certification: 'Certificado de Especialista em Marketing Digital',
                investment: 'R$ 897,00 à vista ou 12x de R$ 87,00'
            },
            programacao: {
                title: 'Programação & Tecnologia',
                description: 'Aprenda a programar do zero e desenvolva aplicações modernas usando as tecnologias mais requisitadas pelo mercado.',
                objectives: [
                    'Dominar lógica de programação',
                    'Desenvolver aplicações web completas',
                    'Trabalhar com bancos de dados',
                    'Criar e consumir APIs',
                    'Implementar soluções em cloud'
                ],
                methodology: 'Aulas práticas, projetos individuais, trabalho em equipe e portfólio',
                certification: 'Certificado de Desenvolvedor Full Stack',
                investment: 'R$ 1.497,00 à vista ou 12x de R$ 147,00'
            }
        };

        const module = modules[moduleId];
        if (!module) return;

        const detailsContainer = this.container.querySelector('#module-details');
        if (!detailsContainer) return;

        detailsContainer.innerHTML = `
            <div class="module-detail-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${module.title}</h2>
                        <button class="btn btn-secondary" onclick="Modules.closeModuleDetails()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="detail-section">
                            <h3>Sobre o Módulo</h3>
                            <p>${module.description}</p>
                        </div>

                        <div class="detail-section">
                            <h3>Objetivos de Aprendizagem</h3>
                            <ul>
                                ${module.objectives.map(obj => `<li>${obj}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="detail-section">
                            <h3>Metodologia</h3>
                            <p>${module.methodology}</p>
                        </div>

                        <div class="detail-section">
                            <h3>Certificação</h3>
                            <p><strong>${module.certification}</strong></p>
                        </div>

                        <div class="detail-section">
                            <h3>Investimento</h3>
                            <p class="investment">${module.investment}</p>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="Modules.closeModuleDetails()">
                            Fechar
                        </button>
                        <button class="btn btn-primary" onclick="ModuleRenderer.startModule('${moduleId}')">
                            <i class="fas fa-play"></i>
                            Começar Módulo
                        </button>
                    </div>
                </div>
            </div>
        `;

        detailsContainer.classList.add('active');
    }

    closeModuleDetails() {
        const detailsContainer = this.container.querySelector('#module-details');
        if (detailsContainer) {
            detailsContainer.classList.remove('active');
        }
    }

    startModule(moduleId) {
        // Implementar lógica para iniciar módulo
        console.log(`Starting module: ${moduleId}`);
        NavigationManager.showView('module-view');
    }

    refresh() {
        this.renderModules();
    }
}

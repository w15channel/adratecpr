// ADRA-TEC - Sistema de Gerenciamento de Cursos
// Sistema completo para conteúdo educacional interativo

class CourseManager {
    constructor() {
        this.currentCourse = null;
        this.currentChapter = null;
        this.userProgress = this.loadUserProgress();
        this.achievements = this.loadAchievements();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCourseContent();
        this.updateUI();
    }

    // Carrega progresso do usuário
    loadUserProgress() {
        const saved = localStorage.getItem('adra-tec_course_progress');
        return saved ? JSON.parse(saved) : {
            modules: {
                administrativo: {
                    completed: [],
                    current: null,
                    xp: 0,
                    started_at: null
                },
                financeiro: {
                    completed: [],
                    current: null,
                    xp: 0,
                    started_at: null
                },
                marketing: {
                    completed: [],
                    current: null,
                    xp: 0,
                    started_at: null
                },
                programacao: {
                    completed: [],
                    current: null,
                    xp: 0,
                    started_at: null
                }
            },
            total_xp: 0,
            level: 1,
            streak: 0,
            last_access: null
        };
    }

    // Salva progresso do usuário
    saveUserProgress() {
        localStorage.setItem('adra-tec_course_progress', JSON.stringify(this.userProgress));
        this.updateUI();
    }

    // Carrega conquistas
    loadAchievements() {
        const saved = localStorage.getItem('adra-tec_achievements');
        return saved ? JSON.parse(saved) : [];
    }

    // Adiciona conquista
    addAchievement(achievement) {
        if (!this.achievements.find(a => a.id === achievement.id)) {
            this.achievements.push({
                ...achievement,
                earned_at: new Date().toISOString()
            });
            localStorage.setItem('adra-tec_achievements', JSON.stringify(this.achievements));
            this.showAchievementNotification(achievement);
        }
    }

    // Mostra notificação de conquista
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>Conquista Desbloqueada!</h4>
                    <p>${achievement.name}</p>
                    <small>${achievement.description}</small>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Carrega conteúdo do curso
    async loadCourseContent() {
        try {
            // Em produção, isso viria de uma API
            // Por enquanto, vamos usar os arquivos JSON criados
            console.log('Sistema de cursos carregado!');
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
        }
    }

    // Inicia um capítulo
    startChapter(moduleId, chapterId) {
        this.currentChapter = {
            module: moduleId,
            id: chapterId,
            started_at: new Date().toISOString()
        };

        // Atualiza progresso
        if (!this.userProgress.modules[moduleId].started_at) {
            this.userProgress.modules[moduleId].started_at = new Date().toISOString();
        }
        this.userProgress.modules[moduleId].current = chapterId;
        this.userProgress.last_access = new Date().toISOString();
        
        this.saveUserProgress();
        this.renderChapter();
    }

    // Renderiza conteúdo do capítulo
    async renderChapter() {
        if (!this.currentChapter) return;

        try {
            // Tenta diferentes caminhos para compatibilidade
            const possiblePaths = [
                `content/${this.currentChapter.module}/${this.currentChapter.id}.json`,
                `./content/${this.currentChapter.module}/${this.currentChapter.id}.json`,
                `/content/${this.currentChapter.module}/${this.currentChapter.id}.json`
            ];

            let response = null;
            let chapter = null;

            // Tenta cada caminho até encontrar um que funcione
            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) {
                        chapter = await response.json();
                        console.log('Capítulo carregado com sucesso:', path);
                        break;
                    }
                } catch (e) {
                    console.log('Tentando próximo caminho:', path, e);
                    continue;
                }
            }

            // Se não conseguiu carregar o JSON, usa o conteúdo embutido
            if (!chapter) {
                console.log('Usando conteúdo embutido para:', this.currentChapter.id);
                chapter = this.getFallbackChapter(this.currentChapter.id);
            }
            
            this.currentCourse = chapter;
            this.renderChapterContent(chapter);
            
            // Atualiza navegação
            this.updateCourseNavigation();
            
        } catch (error) {
            console.error('Erro ao carregar capítulo:', error);
            this.showErrorMessage('Não foi possível carregar o capítulo. Tente novamente.');
        }
    }

    // Conteúdo fallback para garantir funcionamento
    getFallbackChapter(chapterId) {
        const fallbackContent = {
            'capitulo-1': {
                id: 'admin-01',
                title: 'Capítulo 1: Administração - Você já administrou alguma coisa hoje?',
                module: 'administrativo',
                order: 1,
                xp_reward: 100,
                badge_earned: 'primeiros-passos',
                estimated_time: 15,
                difficulty: 'iniciante',
                content: {
                    introduction: {
                        title: 'E aí! Já pensou que você talvez já seja um administrador?',
                        text: 'Sério! Se você já organizou uma festa, coordenou um trabalho escolar ou administrou seu tempo, você já praticou administração! Administração está em todo lugar - é a arte de fazer as coisas acontecerem através das pessoas!',
                        engaging_question: 'Qual foi a última coisa que você organizou?'
                    },
                    main_content: [
                        {
                            type: 'explanation',
                            title: 'O que é Administração?',
                            text: 'Administração é como ser o maestro de uma orquestra - você não toca todos os instrumentos, mas faz todos tocarem em harmonia para criar uma música incrível!',
                            key_points: [
                                '🎯 **Objetivos claros**: Saber o que quer alcançar',
                                '👥 **Trabalho com pessoas**: Fazer as coisas através dos outros',
                                '⚡ **Eficiência**: Fazer da melhor forma possível',
                                '🎯 **Eficácia**: Alcançar os resultados desejados'
                            ]
                        }
                    ],
                    special_box: {
                        type: 'fala_serio',
                        title: 'Fala Sério!',
                        content: 'Você sabia que a administração é considerada uma das áreas mais importantes do mundo? Sem ela, empresas, países e até sua vida pessoal seriam um caos total!',
                        icon: '🧠'
                    },
                    activity: {
                        type: 'mao_na_massa',
                        title: 'Atividade Mão na Massa - Seu Diagnóstico Administrativo!',
                        instructions: [
                            'Pense em algo que você organizou recentemente:',
                            '1️⃣ Qual era o objetivo?',
                            '2️⃣ Quem participou?',
                            '3️⃣ Como você dividiu as tarefas?',
                            '4️⃣ O que deu certo e o que poderia melhorar?',
                            '5️⃣ Você usou algum dos 4 elementos da administração?'
                        ],
                        reward: '50 XP',
                        completion_message: 'Parabéns! Você já pensa como um administrador! 🎉'
                    },
                    quiz: {
                        title: 'Quiz Inicial - Teste seus instintos administrativos!',
                        questions: [
                            {
                                id: 1,
                                question: 'O que significa administrar?',
                                options: [
                                    'a) Fazer tudo sozinho',
                                    'b) Obter resultados através de outras pessoas',
                                    'c) Apenas dar ordens'
                                ],
                                correct: 1,
                                explanation: 'Administrar é fazer as coisas através de pessoas com eficiência!'
                            },
                            {
                                id: 2,
                                question: 'Qual é mais importante na administração?',
                                options: [
                                    'a) Apenas ter objetivos',
                                    'b) Apenas ter pessoas',
                                    'c) Alcançar resultados de forma eficiente'
                                ],
                                correct: 2,
                                explanation: 'O objetivo final é alcançar resultados da melhor forma possível!'
                            }
                        ],
                        passing_score: 70,
                        reward: '25 XP'
                    },
                    next_steps: {
                        title: 'Próximos Passos',
                        message: 'Excelente começo! Agora que você já entende o básico, vamos descobrir a fórmula mágica que todos os administradores usam - o PODC!',
                        teaser: '🔮 Próximo capítulo: PODC - A Fórmula Mágica da Administração!'
                    }
                }
            }
        };

        return fallbackContent[chapterId] || {
            title: 'Capítulo em desenvolvimento',
            content: {
                introduction: {
                    title: 'Contúdo sendo preparado!',
                    text: 'Este capítulo está sendo finalizado. Em breve estará disponível com todo o conteúdo interativo!'
                }
            }
        };
    }

    // Renderiza conteúdo do capítulo na tela
    renderChapterContent(chapter) {
        const container = document.getElementById('course-content');
        if (!container) return;

        container.innerHTML = `
            <div class="chapter-container">
                <div class="chapter-header">
                    <div class="chapter-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.getChapterProgress(chapter)}%"></div>
                        </div>
                        <span class="progress-text">${this.getChapterProgress(chapter)}% completo</span>
                    </div>
                    <div class="chapter-info">
                        <h1>${chapter.title}</h1>
                        <div class="chapter-meta">
                            <span class="difficulty ${chapter.difficulty}">${chapter.difficulty}</span>
                            <span class="time">⏱️ ${chapter.estimated_time} min</span>
                            <span class="xp">🏆 ${chapter.xp_reward} XP</span>
                        </div>
                    </div>
                </div>

                <div class="chapter-content">
                    ${this.renderChapterSections(chapter.content)}
                </div>

                <div class="chapter-actions">
                    ${this.renderChapterActions(chapter)}
                </div>
            </div>
        `;

        // Configura eventos interativos
        this.setupChapterInteractions(chapter);
    }

    // Seleciona módulo
    selectModule(moduleId) {
        const courseContent = document.getElementById('course-content');
        const chaptersList = document.getElementById('chapters-list');
        const modulesSelector = document.querySelector('.modules-selector');
        
        // Esconde seletor de módulos
        if (modulesSelector) modulesSelector.style.display = 'none';
        
        // Mostra lista de capítulos
        if (chaptersList) {
            chaptersList.style.display = 'block';
            this.renderChaptersList(moduleId);
        }
        
        // Mostra conteúdo do curso
        if (courseContent) {
            courseContent.style.display = 'block';
            // Inicia com o primeiro capítulo não completado
            this.startFirstAvailableChapter(moduleId);
        }
    }

    // Renderiza lista de capítulos
    renderChaptersList(moduleId) {
        const chaptersGrid = document.getElementById('chapters-grid');
        if (!chaptersGrid) return;

        // Lista de capítulos do módulo administrativo
        const chapters = [
            { id: 'capitulo-1.json', title: 'Capítulo 1: Administração - Você já administrou alguma coisa hoje?', xp: 100, completed: false },
            { id: 'capitulo-2.json', title: 'Capítulo 2: PODC - A Fórmula Mágica da Administração!', xp: 150, completed: false },
            { id: 'capitulo-3.json', title: 'Capítulo 3: Tipos de Empresas - Do MEI ao Mega Corporation!', xp: 120, completed: false },
            { id: 'capitulo-4.json', title: 'Capítulo 4: Estrutura Organizacional - O Esqueleto das Empresas!', xp: 130, completed: false },
            { id: 'capitulo-5.json', title: 'Capítulo 5: Programa 5S - A Mágica da Organização Japonesa!', xp: 140, completed: false },
            { id: 'capitulo-6.json', title: 'Capítulo 6: O Super-Herói da Empresa - Funções do Auxiliar Administrativo!', xp: 110, completed: false },
            { id: 'capitulo-7.json', title: 'Capítulo 7: Mercado de Trabalho e Ética - O Código dos Campeões!', xp: 120, completed: false },
            { id: 'capitulo-8.json', title: 'Capítulo 8: Trabalho em Equipe - O Poder da União!', xp: 115, completed: false },
            { id: 'capitulo-9.json', title: 'Capítulo 9: Departamento Pessoal - O Coração Humano das Empresas!', xp: 125, completed: false },
            { id: 'capitulo-10.json', title: 'Capítulo 10: Técnicas de Arquivamento - A Ordem Perfeita!', xp: 105, completed: false },
            { id: 'capitulo-11.json', title: 'Capítulo 11: Noções de Contabilidade - O Dinheiro Fala!', xp: 130, completed: false },
            { id: 'capitulo-12.json', title: 'Capítulo 12: Conclusão - Você é um Administrador em Formação!', xp: 150, completed: false }
        ];

        // Marca capítulos completos
        const moduleProgress = this.userProgress.modules[moduleId];
        chapters.forEach(chapter => {
            chapter.completed = moduleProgress.completed.includes(chapter.id.replace('.json', ''));
        });

        chaptersGrid.innerHTML = chapters.map((chapter, index) => `
            <div class="chapter-card ${chapter.completed ? 'completed' : ''}" onclick="courseManager.startChapter('${moduleId}', '${chapter.id.replace('.json', '')}')">
                <div class="chapter-number">
                    ${index + 1}
                </div>
                <div class="chapter-info">
                    <h4>${chapter.title}</h4>
                    <div class="chapter-meta">
                        <span class="xp">🏆 ${chapter.xp} XP</span>
                        ${chapter.completed ? '<span class="completed-badge">✅ Concluído</span>' : '<span class="available-badge">📖 Disponível</span>'}
                    </div>
                </div>
                <div class="chapter-icon">
                    ${chapter.completed ? '✅' : '📖'}
                </div>
            </div>
        `).join('');
    }

    // Inicia primeiro capítulo disponível
    startFirstAvailableChapter(moduleId) {
        const chapters = ['capitulo-1', 'capitulo-2', 'capitulo-3', 'capitulo-4', 'capitulo-5', 'capitulo-6', 'capitulo-7', 'capitulo-8', 'capitulo-9', 'capitulo-10', 'capitulo-11', 'capitulo-12'];
        const moduleProgress = this.userProgress.modules[moduleId];
        
        // Encontra primeiro capítulo não completado
        const nextChapter = chapters.find(ch => !moduleProgress.completed.includes(ch));
        
        if (nextChapter) {
            this.startChapter(moduleId, nextChapter);
        } else {
            // Todos completos, mostra resumo
            this.showModuleCompletion(moduleId);
        }
    }

    // Volta para seleção de módulos
    backToModules() {
        const courseContent = document.getElementById('course-content');
        const chaptersList = document.getElementById('chapters-list');
        const modulesSelector = document.querySelector('.modules-selector');
        
        // Esconde conteúdo do curso
        if (courseContent) courseContent.style.display = 'none';
        if (chaptersList) chaptersList.style.display = 'none';
        
        // Mostra seletor de módulos
        if (modulesSelector) modulesSelector.style.display = 'block';
    }

    // Mostra conclusão do módulo
    showModuleCompletion(moduleId) {
        const courseContent = document.getElementById('course-content');
        if (!courseContent) return;

        const moduleProgress = this.userProgress.modules[moduleId];
        const totalXP = moduleProgress.xp;

        courseContent.innerHTML = `
            <div class="module-completion">
                <div class="completion-header">
                    <h1>🎉 Módulo Concluído!</h1>
                    <p>Parabéns! Você completou o módulo ${moduleId}</p>
                </div>
                
                <div class="completion-stats">
                    <div class="stat-card">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-info">
                            <div class="stat-value">${totalXP}</div>
                            <div class="stat-label">XP Total</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📚</div>
                        <div class="stat-info">
                            <div class="stat-value">${moduleProgress.completed.length}</div>
                            <div class="stat-label">Capítulos Concluídos</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-info">
                            <div class="stat-value">~2h</div>
                            <div class="stat-label">Tempo de Estudo</div>
                        </div>
                    </div>
                </div>

                <div class="completion-actions">
                    <button class="btn btn-secondary" onclick="courseManager.backToModules()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar aos Módulos
                    </button>
                    <button class="btn btn-primary" onclick="courseManager.reviewModule('${moduleId}')">
                        <i class="fas fa-redo"></i>
                        Revisar Módulo
                    </button>
                </div>
            </div>
        `;
    }

    // Revisa módulo
    reviewModule(moduleId) {
        this.renderChaptersList(moduleId);
        document.getElementById('chapters-list').style.display = 'block';
        document.getElementById('course-content').style.display = 'none';
    }

    // Renderiza seções do capítulo
    renderChapterSections(content) {
        let html = '';

        // Introdução
        if (content.introduction) {
            html += this.renderIntroduction(content.introduction);
        }

        // Conteúdo principal
        if (content.main_content) {
            content.main_content.forEach(section => {
                html += this.renderSection(section);
            });
        }

        // Caixa especial
        if (content.special_box) {
            html += this.renderSpecialBox(content.special_box);
        }

        // Atividade
        if (content.activity) {
            html += this.renderActivity(content.activity);
        }

        // Quiz
        if (content.quiz) {
            html += this.renderQuiz(content.quiz);
        }

        // Próximos passos
        if (content.next_steps) {
            html += this.renderNextSteps(content.next_steps);
        }

        return html;
    }

    // Renderiza introdução
    renderIntroduction(intro) {
        return `
            <section class="introduction-section">
                <div class="intro-content">
                    <h2>${intro.title}</h2>
                    <p class="intro-text">${intro.text}</p>
                    ${intro.engaging_question ? `
                        <div class="engaging-question">
                            <p>❓ ${intro.engaging_question}</p>
                            <textarea class="reflection-input" placeholder="Digite sua resposta..."></textarea>
                        </div>
                    ` : ''}
                </div>
            </section>
        `;
    }

    // Renderiza seção genérica
    renderSection(section) {
        switch (section.type) {
            case 'explanation':
                return this.renderExplanationSection(section);
            case 'example':
                return this.renderExampleSection(section);
            case 'detailed_section':
                return this.renderDetailedSection(section);
            case 'company_types':
                return this.renderCompanyTypesSection(section);
            case 'decision_guide':
                return this.renderDecisionGuide(section);
            case 'organizational_chart':
                return this.renderOrgChartSection(section);
            case 'structure_models':
                return this.renderStructureModels(section);
            case 'five_s_detailed':
                return this.render5SDetailed(section);
            case 'implementation_guide':
                return this.renderImplementationGuide(section);
            default:
                return `<section class="content-section">${section.content || ''}</section>`;
        }
    }

    // Renderiza seção de explicação
    renderExplanationSection(section) {
        return `
            <section class="explanation-section">
                <h3>${section.title}</h3>
                <p>${section.text}</p>
                ${section.key_concepts ? this.renderKeyConcepts(section.key_concepts) : ''}
                ${section.acronym_breakdown ? this.renderAcronymBreakdown(section.acronym_breakdown) : ''}
            </section>
        `;
    }

    // Renderiza conceitos-chave
    renderKeyConcepts(concepts) {
        return `
            <div class="key-concepts">
                <h4>Conceitos-Chave:</h4>
                <div class="concepts-grid">
                    ${concepts.map(concept => `
                        <div class="concept-card">
                            <strong>${concept.term || concept.word}:</strong>
                            <p>${concept.definition || concept.meaning}</p>
                            ${concept.example ? `<small><em>Ex: ${concept.example}</em></small>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Renderiza acrônimo
    renderAcronymBreakdown(acronym) {
        return `
            <div class="acronym-breakdown">
                <h4>O que significa ${acronym.title}:</h4>
                <div class="acronym-grid">
                    ${acronym.map(item => `
                        <div class="acronym-item">
                            <div class="acronym-letter">${item.letter}</div>
                            <div class="acronym-details">
                                <strong>${item.word}</strong>
                                <p>${item.simple_definition}</p>
                                <span>${item.emoji}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Renderiza caixa especial
    renderSpecialBox(box) {
        return `
            <div class="special-box ${box.type}">
                <div class="box-header">
                    <span class="box-icon">${box.icon}</span>
                    <h4>${box.title}</h4>
                </div>
                <p>${box.content}</p>
            </div>
        `;
    }

    // Renderiza atividade
    renderActivity(activity) {
        return `
            <section class="activity-section">
                <div class="activity-header">
                    <h3>🎯 ${activity.title}</h3>
                    <span class="activity-reward">Recompensa: ${activity.reward}</span>
                </div>
                <div class="activity-content">
                    <div class="activity-instructions">
                        <h4>Instruções:</h4>
                        <ol>
                            ${activity.instructions.map(inst => `<li>${inst}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="activity-actions">
                        <button class="btn btn-primary" onclick="courseManager.completeActivity('${activity.type}')">
                            <i class="fas fa-check"></i>
                            Marcar como Concluída
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    // Renderiza quiz
    renderQuiz(quiz) {
        return `
            <section class="quiz-section">
                <div class="quiz-header">
                    <h3>📝 ${quiz.title}</h3>
                    <span class="quiz-info">Acerte ${quiz.passing_score}% para ganhar ${quiz.reward} XP</span>
                </div>
                <div class="quiz-content">
                    ${quiz.questions.map((q, index) => `
                        <div class="question-card" data-question="${q.id}">
                            <div class="question-header">
                                <span class="question-number">Questão ${index + 1}</span>
                            </div>
                            <div class="question-text">
                                <p>${q.question}</p>
                            </div>
                            <div class="question-options">
                                ${q.options.map((opt, optIndex) => `
                                    <label class="option-label">
                                        <input type="radio" name="question_${q.id}" value="${optIndex}">
                                        <span class="option-text">${opt}</span>
                                    </label>
                                `).join('')}
                            </div>
                            <div class="question-feedback" style="display: none;">
                                <p class="feedback-text"></p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-actions">
                    <button class="btn btn-primary" onclick="courseManager.submitQuiz()">
                        <i class="fas fa-paper-plane"></i>
                        Enviar Respostas
                    </button>
                    <button class="btn btn-secondary" onclick="courseManager.showQuizResults()">
                        <i class="fas fa-chart-bar"></i>
                        Ver Resultados
                    </button>
                </div>
            </section>
        `;
    }

    // Renderiza próximos passos
    renderNextSteps(nextSteps) {
        return `
            <section class="next-steps-section">
                <div class="next-steps-content">
                    <h3>${nextSteps.title}</h3>
                    <p>${nextSteps.message}</p>
                    ${nextSteps.teaser ? `
                        <div class="teaser-box">
                            <p>${nextSteps.teaser}</p>
                        </div>
                    ` : ''}
                </div>
            </section>
        `;
    }

    // Configura interações do capítulo
    setupChapterInteractions(chapter) {
        // Configura quiz
        this.setupQuizInteractions(chapter.quiz);
        
        // Configura atividades
        this.setupActivityInteractions(chapter.activity);
        
        // Configura elementos interativos
        this.setupInteractiveElements(chapter.interactive_elements);
    }

    // Configura interações do quiz
    setupQuizInteractions(quiz) {
        if (!quiz) return;

        const questions = document.querySelectorAll('.question-card');
        questions.forEach(question => {
            const options = question.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                option.addEventListener('change', () => {
                    this.checkAnswer(question, quiz);
                });
            });
        });
    }

    // Verifica resposta do quiz
    checkAnswer(questionElement, quiz) {
        const questionId = questionElement.dataset.question;
        const selectedOption = questionElement.querySelector('input:checked');
        const feedback = questionElement.querySelector('.question-feedback');
        const feedbackText = feedback.querySelector('.feedback-text');

        if (!selectedOption) return;

        const question = quiz.questions.find(q => q.id == questionId);
        const selectedIndex = parseInt(selectedOption.value);
        const isCorrect = selectedIndex === question.correct;

        feedback.style.display = 'block';
        feedbackText.textContent = question.explanation;
        
        questionElement.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Desabilita outras opções
        const allOptions = questionElement.querySelectorAll('input[type="radio"]');
        allOptions.forEach(opt => opt.disabled = true);
    }

    // Envia quiz
    submitQuiz() {
        const questions = document.querySelectorAll('.question-card');
        let correct = 0;
        let total = questions.length;

        questions.forEach(question => {
            if (question.classList.contains('correct')) {
                correct++;
            }
        });

        const percentage = Math.round((correct / total) * 100);
        const currentChapter = this.currentCourse;

        if (percentage >= currentChapter.quiz.passing_score) {
            this.completeChapter();
            this.showQuizResults(true, percentage, correct, total);
        } else {
            this.showQuizResults(false, percentage, correct, total);
        }
    }

    // Mostra resultados do quiz
    showQuizResults(success = null, percentage = null, correct = null, total = null) {
        if (success === null) {
            // Mostra resultados do quiz atual
            const questions = document.querySelectorAll('.question-card');
            let correctCount = 0;
            questions.forEach(q => {
                if (q.classList.contains('correct')) correctCount++;
            });
            percentage = Math.round((correctCount / questions.length) * 100);
        }

        const modal = document.createElement('div');
        modal.className = 'modal quiz-results-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Resultados do Quiz</h3>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="results-summary">
                        <div class="score-circle">
                            <span class="score-percentage">${percentage}%</span>
                        </div>
                        <div class="score-details">
                            <p>Acertos: ${correct || '??'} / ${total || '??'}</p>
                            <p class="${success ? 'success' : 'fail'}">
                                ${success ? '✅ Parabéns! Você passou!' : '❌ Estude um pouco mais e tente novamente!'}
                            </p>
                        </div>
                    </div>
                    ${success ? `
                        <div class="rewards">
                            <p>🏆 Você ganhou ${this.currentCourse.quiz.reward} XP!</p>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    ${!success ? `
                        <button class="btn btn-primary" onclick="location.reload()">
                            <i class="fas fa-redo"></i>
                            Tentar Novamente
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="courseManager.nextChapter()">
                            <i class="fas fa-arrow-right"></i>
                            Próximo Capítulo
                        </button>
                    `}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 100);
    }

    // Completa capítulo
    completeChapter() {
        const chapter = this.currentCourse;
        const moduleProgress = this.userProgress.modules[chapter.module];

        // Adiciona XP
        const xpGained = chapter.xp_reward;
        moduleProgress.xp += xpGained;
        this.userProgress.total_xp += xpGained;

        // Marca como completado
        if (!moduleProgress.completed.includes(chapter.id)) {
            moduleProgress.completed.push(chapter.id);
        }

        // Adiciona conquistas
        if (chapter.achievements) {
            chapter.achievements.forEach(achievement => {
                this.addAchievement(achievement);
            });
        }

        // Atualiza nível
        this.updateUserLevel();

        // Salva progresso
        this.saveUserProgress();

        // Mostra notificação
        this.showChapterCompletionNotification(chapter, xpGained);
    }

    // Mostra notificação de conclusão de capítulo
    showChapterCompletionNotification(chapter, xpGained) {
        const notification = document.createElement('div');
        notification.className = 'chapter-completion-notification';
        notification.innerHTML = `
            <div class="completion-content">
                <div class="completion-icon">🎉</div>
                <div class="completion-info">
                    <h4>Capítulo Concluído!</h4>
                    <p>${chapter.title}</p>
                    <span>+${xpGained} XP</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Atualiza nível do usuário
    updateUserLevel() {
        const totalXP = this.userProgress.total_xp;
        const newLevel = Math.floor(totalXP / 100) + 1;
        
        if (newLevel > this.userProgress.level) {
            this.userProgress.level = newLevel;
            this.showLevelUpNotification(newLevel);
        }
    }

    // Mostra notificação de level up
    showLevelUpNotification(newLevel) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">⬆️</div>
                <div class="level-up-info">
                    <h4>LEVEL UP!</h4>
                    <p>Você alcançou o nível ${newLevel}!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Calcula progresso do capítulo
    getChapterProgress(chapter) {
        // Simplificado - em produção, calcularia baseado em atividades completas
        return 0;
    }

    // Renderiza ações do capítulo
    renderChapterActions(chapter) {
        return `
            <div class="chapter-navigation">
                <button class="btn btn-secondary" onclick="courseManager.previousChapter()">
                    <i class="fas fa-arrow-left"></i>
                    Capítulo Anterior
                </button>
                <button class="btn btn-primary" onclick="courseManager.nextChapter()">
                    Próximo Capítulo
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
    }

    // Navegação entre capítulos
    nextChapter() {
        // Implementar lógica de navegação
        console.log('Próximo capítulo');
    }

    previousChapter() {
        // Implementar lógica de navegação
        console.log('Capítulo anterior');
    }

    // Atualiza UI
    updateUI() {
        // Atualiza informações do usuário no header
        this.updateUserInfo();
        
        // Atualiza progresso nos módulos
        this.updateModulesProgress();
    }

    // Atualiza informações do usuário
    updateUserInfo() {
        const userName = document.getElementById('header-name');
        const userPoints = document.getElementById('header-points');
        
        if (userName) userName.textContent = this.userProgress.total_xp > 0 ? 'Estudante' : 'Visitante';
        if (userPoints) userPoints.textContent = `${this.userProgress.total_xp} pts`;
    }

    // Atualiza progresso dos módulos
    updateModulesProgress() {
        // Implementar atualização visual dos módulos
    }

    // Mostra mensagem de erro
    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Configura event listeners
    setupEventListeners() {
        // Event listeners globais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }
}

// Tornar global
window.CourseManager = CourseManager;
window.courseManager = new CourseManager();

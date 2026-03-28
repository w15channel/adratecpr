// ADRA-TEC OS - Sistema Operacional Educacional com Login e Banco de Dados
class OSTecManager {
    constructor() {
        this.loginScreen = document.getElementById('login-screen');
        this.osSystem = document.getElementById('os-system');
        this.bootScreen = document.getElementById('boot-screen');
        this.desktop = document.getElementById('desktop');
        this.taskbar = document.querySelector('.taskbar');
        this.startButton = document.getElementById('start-button');
        this.startMenuDropdown = document.getElementById('start-menu-dropdown');
        this.windowContainer = document.getElementById('window-container');
        this.notificationPanel = document.getElementById('notification-panel');
        this.clock = document.getElementById('clock');
        
        this.windows = [];
        this.activeWindow = null;
        this.isDragging = false;
        this.currentWindow = null;
        this.offset = { x: 0, y: 0 };
        this.moduleTopics = {
            administrativo: [
                'Introdução à Administração',
                'Processos Internos e Rotinas',
                'Organização de Documentos',
                'Gestão de Pessoas'
            ],
            empreendedorismo: [
                'Mentalidade Empreendedora',
                'Modelagem de Negócios',
                'Validação de Ideias',
                'Plano de Ação Inicial'
            ],
            marketing: [
                'Fundamentos de Marketing',
                'Posicionamento de Marca',
                'Marketing Digital',
                'Métricas e Otimização'
            ],
            programacao: [
                'Lógica de Programação',
                'Estruturas de Dados Básicas',
                'Boas Práticas de Código',
                'Projetos Práticos'
            ]
        };
        
        // Dados do usuário
        this.userData = {
            name: '',
            name2: '',
            accessType: 'individual',
            progress: {
                modules: {
                    administrativo: { completed: [], xp: 0, progress: 0 },
                    empreendedorismo: { completed: [], xp: 0, progress: 0 },
                    marketing: { completed: [], xp: 0, progress: 0 },
                    programacao: { completed: [], xp: 0, progress: 0 }
                },
                totalXP: 0,
                achievements: [],
                studyTime: 0,
                lastAccess: null
            }
        };
        
        this.init();
    }
    
    init() {
        // Inicializar sistema de login
        this.setupLoginSystem();
        
        // Verificar se há dados salvos
        this.loadSavedData();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Iniciar clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }
    
    setupLoginSystem() {
        // Tipo de acesso
        const accessTypeBtns = document.querySelectorAll('.access-type-btn');
        accessTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                accessTypeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.userData.accessType = btn.dataset.type;
                this.updateNameLabels();
            });
        });
        
        // Botão de login
        const loginBtn = document.getElementById('login-btn');
        loginBtn.addEventListener('click', () => this.performLogin());
        
        // Enter no formulário
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.loginScreen.classList.contains('hidden')) {
                this.performLogin();
            }
        });
        
        // Carregar banco de dados
        const loadDbBtn = document.getElementById('load-db-btn');
        const dbFileInput = document.getElementById('db-file-input');
        
        loadDbBtn.addEventListener('click', () => dbFileInput.click());
        dbFileInput.addEventListener('change', (e) => this.loadDatabase(e));
        
        // Menu iniciar - carregar BD
        const loadDbMenuBtn = document.getElementById('load-db-menu-btn');
        const dbUploadInput = document.getElementById('db-upload-input');
        
        loadDbMenuBtn.addEventListener('click', () => dbUploadInput.click());
        dbUploadInput.addEventListener('change', (e) => this.loadDatabase(e));
        
        // Menu iniciar - salvar BD
        const saveDbBtn = document.getElementById('save-db-btn');
        saveDbBtn.addEventListener('click', () => this.saveDatabase());
        
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => this.logout());
    }
    
    updateNameLabels() {
        const nameLabel = document.getElementById('name-label');
        const duplaNames = document.getElementById('dupla-names');
        
        if (this.userData.accessType === 'dupla') {
            nameLabel.textContent = 'Nome do Primeiro Aluno';
            duplaNames.classList.remove('hidden');
        } else {
            nameLabel.textContent = 'Seu Nome';
            duplaNames.classList.add('hidden');
        }
    }
    
    performLogin() {
        const nameInput = document.getElementById('student-name');
        const name2Input = document.getElementById('student-name-2');
        
        const name = nameInput.value.trim();
        const name2 = name2Input.value.trim();
        
        if (!name) {
            this.showNotification('Por favor, preencha seu nome!', 'error');
            return;
        }
        
        if (this.userData.accessType === 'dupla' && !name2) {
            this.showNotification('Por favor, preencha o nome do segundo aluno!', 'error');
            return;
        }
        
        // Salvar dados do usuário
        this.userData.name = name;
        this.userData.name2 = name2;
        this.userData.progress.lastAccess = new Date().toISOString();
        
        // Salvar em cookies
        this.saveUserData();
        
        // Iniciar boot sequence
        this.startBootSequence();
    }
    
    startBootSequence() {
        // Atualizar mensagens de boot
        const bootUserName = document.getElementById('boot-user-name');
        const displayName = this.userData.accessType === 'dupla' 
            ? `${this.userData.name} e ${this.userData.name2}`
            : this.userData.name;
        bootUserName.textContent = displayName;
        
        // Mostrar boot screen
        this.loginScreen.classList.add('hidden');
        this.osSystem.classList.remove('hidden');
        this.bootScreen.classList.remove('hidden');
        
        // Atualizar welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.textContent = `Bem-vindo(a), ${displayName}!`;
        
        // Atualizar menu iniciar
        const menuUsername = document.getElementById('menu-username');
        menuUsername.textContent = displayName;
        
        setTimeout(() => {
            this.bootScreen.classList.add('hidden');
            this.desktop.classList.remove('hidden');
            this.taskbar.classList.remove('hidden');
            this.showWelcomeNotification();
        }, 3000);
    }
    
    setupEventListeners() {
        // Menu Iniciar
        this.startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', () => {
            this.closeStartMenu();
        });
        
        this.startMenuDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Ícones da área de trabalho
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const module = icon.dataset.module;
                const tool = icon.dataset.tool;
                if (module) {
                    this.openModule(module);
                } else if (tool) {
                    this.openTool(tool);
                }
            });
        });
        
        // Itens do menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const module = item.dataset.module;
                const tool = item.dataset.tool;
                
                if (module) {
                    this.openModule(module);
                } else if (tool === 'progress') {
                    this.openProgressWindow();
                } else if (tool === 'achievements') {
                    this.openAchievementsWindow();
                } else if (tool === 'settings') {
                    this.openSettingsWindow();
                } else if (tool === 'help') {
                    this.openHelpWindow();
                } else if (tool === 'about') {
                    this.openAboutWindow();
                }
                
                this.closeStartMenu();
            });
        });
        
        // Sistema de notificações
        document.getElementById('notification-icon').addEventListener('click', () => {
            this.toggleNotificationPanel();
        });
        
        document.querySelector('.close-panel').addEventListener('click', () => {
            this.closeNotificationPanel();
        });
        
        // Fechar painel ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#notification-icon') && !e.target.closest('.notification-panel')) {
                this.closeNotificationPanel();
            }
        });
        
        // Sistema de janelas com funcionalidades completas
        this.setupWindowDragging();
        this.setupWindowControls();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeStartMenu();
                this.closeNotificationPanel();
            }
            if (e.ctrlKey && e.key === 'Escape') {
                this.closeAllWindows();
            }
        });
    }
    
    setupWindowControls() {
        // Delegação de eventos para controles de janela
        this.windowContainer.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.window-control.close');
            const minimizeBtn = e.target.closest('.window-control.minimize');
            const maximizeBtn = e.target.closest('.window-control.maximize');
            const header = e.target.closest('.window-header');
            
            if (closeBtn) {
                const windowElement = closeBtn.closest('.os-window');
                const windowData = this.getWindowData(windowElement);
                if (windowData) this.closeWindow(windowData);
            } else if (minimizeBtn) {
                const windowElement = minimizeBtn.closest('.os-window');
                const windowData = this.getWindowData(windowElement);
                if (windowData) this.minimizeWindow(windowData);
            } else if (maximizeBtn) {
                const windowElement = maximizeBtn.closest('.os-window');
                const windowData = this.getWindowData(windowElement);
                if (windowData) this.maximizeWindow(windowData);
            } else if (header) {
                const windowElement = header.closest('.os-window');
                const windowData = this.getWindowData(windowElement);
                if (windowData) this.focusWindow(windowData);
            }
        });
    }
    
    toggleStartMenu() {
        this.startMenuDropdown.classList.toggle('active');
        this.startButton.classList.toggle('active');
    }
    
    closeStartMenu() {
        this.startMenuDropdown.classList.remove('active');
        this.startButton.classList.remove('active');
    }
    
    openModule(moduleId) {
        // Verificar se o módulo já está aberto
        const existingWindow = this.windows.find(w => w.module === moduleId);
        if (existingWindow) {
            this.focusWindow(existingWindow);
            return;
        }
        
        const moduleInfo = this.getModuleInfo(moduleId);
        const window = this.createWindow(moduleInfo);
        
        // Carregar pasta do módulo
        this.loadModuleFolder(window, moduleId);
        
        this.windows.push(window);
        this.focusWindow(window);
        
        // Atualizar progresso
        this.updateModuleProgress(moduleId);
    }
    
    getModuleInfo(moduleId) {
        const modules = {
            administrativo: {
                title: 'Módulo Administrativo',
                icon: 'fas fa-briefcase',
                color: '#667eea'
            },
            empreendedorismo: {
                title: 'Módulo Empreendedorismo',
                icon: 'fas fa-rocket',
                color: '#f093fb'
            },
            marketing: {
                title: 'Módulo Marketing',
                icon: 'fas fa-bullhorn',
                color: '#4facfe'
            },
            programacao: {
                title: 'Módulo Programação',
                icon: 'fas fa-code',
                color: '#43e97b'
            }
        };
        
        return modules[moduleId] || {
            title: 'Módulo Desconhecido',
            icon: 'fas fa-folder',
            color: '#888'
        };
    }
    
    createWindow(moduleInfo) {
        const windowId = 'window-' + Date.now();
        const window = document.createElement('div');
        window.className = 'os-window';
        window.id = windowId;
        window.style.width = '800px';
        window.style.height = '600px';
        window.style.top = Math.random() * 100 + 50 + 'px';
        window.style.left = Math.random() * 200 + 100 + 'px';
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="${moduleInfo.icon}"></i>
                    <span>${moduleInfo.title}</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize" title="Minimizar">−</div>
                    <div class="window-control maximize" title="Maximizar">□</div>
                    <div class="window-control close" title="Fechar">×</div>
                </div>
            </div>
            <div class="window-content">
                <div class="loading-content">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Carregando conteúdo...</p>
                </div>
            </div>
        `;
        
        this.windowContainer.appendChild(window);
        
        // Adicionar à barra de tarefas
        this.addWindowTab(moduleInfo.title, window);
        
        return {
            element: window,
            id: windowId,
            title: moduleInfo.title,
            module: moduleInfo.title.toLowerCase().replace('módulo ', ''),
            minimized: false,
            maximized: false
        };
    }
    
    loadModuleFolder(window, moduleId) {
        const content = window.element.querySelector('.window-content');
        const moduleInfo = this.getModuleInfo(moduleId);
        const topics = this.moduleTopics[moduleId] || [];

        content.innerHTML = `
            <div class="module-folder">
                <div class="folder-toolbar">
                    <button class="folder-action" data-folder-action="toggle">
                        <i class="fas fa-chevron-down"></i>
                        <span>Recolher</span>
                    </button>
                    <div class="folder-path">
                        <i class="fas fa-folder-open"></i>
                        <span>ADRA-TEC OS / ${moduleInfo.title}</span>
                    </div>
                </div>
                <div class="folder-tree expanded">
                    <div class="folder-group">
                        <div class="folder-group-title">
                            <i class="fas fa-folder"></i>
                            <strong>Tópicos do módulo</strong>
                        </div>
                        <ul class="folder-items">
                            ${topics.map(topic => `
                                <li class="folder-item">
                                    <i class="fas fa-file-alt"></i>
                                    <span>${topic}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <p class="folder-footer">Estrutura pronta para você adicionar conteúdos específicos em cada tópico.</p>
            </div>
        `;

        const toggleBtn = content.querySelector('[data-folder-action="toggle"]');
        const folderTree = content.querySelector('.folder-tree');
        const toggleIcon = toggleBtn.querySelector('i');
        const toggleText = toggleBtn.querySelector('span');

        toggleBtn.addEventListener('click', () => {
            const expanded = folderTree.classList.toggle('expanded');
            folderTree.classList.toggle('collapsed', !expanded);
            toggleIcon.className = expanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
            toggleText.textContent = expanded ? 'Recolher' : 'Expandir';
        });
    }
    
    openTool(tool) {
        switch(tool) {
            case 'progress':
                this.openProgressWindow();
                break;
            case 'achievements':
                this.openAchievementsWindow();
                break;
            case 'settings':
                this.openSettingsWindow();
                break;
            case 'about':
                this.openAboutWindow();
                break;
        }
    }
    
    openProgressWindow() {
        const window = this.createWindow({
            title: 'Meu Progresso',
            icon: 'fas fa-chart-line',
            color: '#00d4ff'
        });
        
        window.element.querySelector('.window-content').innerHTML = `
            <div class="progress-dashboard">
                <h3>Seu Progresso de Aprendizado</h3>
                <div class="progress-overview">
                    <div class="overview-card">
                        <i class="fas fa-graduation-cap"></i>
                        <div>
                            <span class="card-number">1</span>
                            <span class="card-label">Módulo Completo</span>
                        </div>
                    </div>
                    <div class="overview-card">
                        <i class="fas fa-clock"></i>
                        <div>
                            <span class="card-number">${this.userData.progress.studyTime}h</span>
                            <span class="card-label">Tempo de Estudo</span>
                        </div>
                    </div>
                    <div class="overview-card">
                        <i class="fas fa-fire"></i>
                        <div>
                            <span class="card-number">7</span>
                            <span class="card-label">Dias Seguidos</span>
                        </div>
                    </div>
                </div>
                <div class="module-progress">
                    <h4>Progresso por Módulo</h4>
                    <div class="progress-item">
                        <span>Administrativo</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.userData.progress.modules.administrativo.progress}%"></div>
                        </div>
                        <span>${this.userData.progress.modules.administrativo.progress}%</span>
                    </div>
                    <div class="progress-item">
                        <span>Empreendedorismo</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.userData.progress.modules.empreendedorismo.progress}%"></div>
                        </div>
                        <span>${this.userData.progress.modules.empreendedorismo.progress}%</span>
                    </div>
                    <div class="progress-item">
                        <span>Marketing</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.userData.progress.modules.marketing.progress}%"></div>
                        </div>
                        <span>${this.userData.progress.modules.marketing.progress}%</span>
                    </div>
                    <div class="progress-item">
                        <span>Programação</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.userData.progress.modules.programacao.progress}%"></div>
                        </div>
                        <span>${this.userData.progress.modules.programacao.progress}%</span>
                    </div>
                </div>
            </div>
        `;
        
        this.windows.push(window);
        this.focusWindow(window);
    }
    
    openAchievementsWindow() {
        const window = this.createWindow({
            title: 'Conquistas',
            icon: 'fas fa-trophy',
            color: '#ffd700'
        });
        
        const achievements = this.userData.progress.achievements || [];
        
        window.element.querySelector('.window-content').innerHTML = `
            <div class="achievements-dashboard">
                <h3>Suas Conquistas</h3>
                <div class="achievements-grid">
                    ${achievements.map(achievement => `
                        <div class="achievement unlocked">
                            <i class="${achievement.icon}"></i>
                            <div>
                                <strong>${achievement.name}</strong>
                                <p>${achievement.description}</p>
                            </div>
                        </div>
                    `).join('')}
                    <div class="achievement locked">
                        <i class="fas fa-lock"></i>
                        <div>
                            <strong>Empreendedor Nato</strong>
                            <p>Complete o módulo de empreendedorismo</p>
                        </div>
                    </div>
                    <div class="achievement locked">
                        <i class="fas fa-lock"></i>
                        <div>
                            <strong>Marketing Master</strong>
                            <p>Complete o módulo de marketing</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.windows.push(window);
        this.focusWindow(window);
    }
    
    openSettingsWindow() {
        const window = this.createWindow({
            title: 'Configurações',
            icon: 'fas fa-cog',
            color: '#30cfd0'
        });
        
        window.element.querySelector('.window-content').innerHTML = `
            <div class="settings-dashboard">
                <h3>Configurações do Sistema</h3>
                <div class="settings-sections">
                    <div class="settings-section">
                        <h4>Perfil do Usuário</h4>
                        <div class="setting-item">
                            <label>Nome</label>
                            <input type="text" value="${this.userData.name}" id="settings-name">
                        </div>
                        ${this.userData.accessType === 'dupla' ? `
                            <div class="setting-item">
                                <label>Segundo Aluno</label>
                                <input type="text" value="${this.userData.name2}" id="settings-name2">
                            </div>
                        ` : ''}
                        <div class="setting-item">
                            <label>Tipo de Acesso</label>
                            <select>
                                <option value="individual" ${this.userData.accessType === 'individual' ? 'selected' : ''}>Individual</option>
                                <option value="dupla" ${this.userData.accessType === 'dupla' ? 'selected' : ''}>Dupla</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h4>Aparência</h4>
                        <div class="setting-item">
                            <label>Tema</label>
                            <select>
                                <option>ADRA-TEC OS (Padrão)</option>
                                <option>Claro</option>
                                <option>Escuro</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Tamanho dos Ícones</label>
                            <input type="range" min="32" max="128" value="64">
                        </div>
                    </div>
                    <div class="settings-section">
                        <h4>Notificações</h4>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" checked> Notificações de conquistas
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" checked> Lembretes de estudo
                            </label>
                        </div>
                    </div>
                </div>
                <div class="settings-actions">
                    <button class="btn-primary" onclick="osManager.saveSettings()">Salvar Configurações</button>
                    <button class="btn-secondary">Restaurar Padrão</button>
                </div>
            </div>
        `;
        
        this.windows.push(window);
        this.focusWindow(window);
    }
    
    openHelpWindow() {
        const window = this.createWindow({
            title: 'Ajuda',
            icon: 'fas fa-question-circle',
            color: '#00d4ff'
        });
        
        window.element.querySelector('.window-content').innerHTML = `
            <div class="help-dashboard">
                <h3>Ajuda e Suporte</h3>
                <div class="help-sections">
                    <div class="help-section">
                        <h4><i class="fas fa-book"></i> Guia Rápido</h4>
                        <ul>
                            <li>Clique nos ícones para abrir módulos e pastas</li>
                            <li>Use o Menu Iniciar para acessar todas as ferramentas</li>
                            <li>Arraste as janelas para reorganizar</li>
                            <li>Use os controles − □ × para minimizar, maximizar e fechar</li>
                            <li>Pressione ESC para fechar menus</li>
                        </ul>
                    </div>
                    <div class="help-section">
                        <h4><i class="fas fa-database"></i> Banco de Dados</h4>
                        <ul>
                            <li>Use "Salvar BD" para exportar seu progresso</li>
                            <li>Use "Carregar BD" para importar dados salvos</li>
                            <li>Seus dados são salvos como arquivo .txt</li>
                            <li>Mantenha backup regular do seu progresso</li>
                        </ul>
                    </div>
                    <div class="help-section">
                        <h4><i class="fas fa-keyboard"></i> Atalhos</h4>
                        <ul>
                            <li><kbd>ESC</kbd> - Fechar menus</li>
                            <li><kbd>Ctrl</kbd> + <kbd>ESC</kbd> - Fechar todas as janelas</li>
                        </ul>
                    </div>
                    <div class="help-section">
                        <h4><i class="fas fa-envelope"></i> Contato</h4>
                        <p>Para suporte adicional:</p>
                        <ul>
                            <li>Email: suporte@adra-tec.com</li>
                            <li>Discord: ADRA-TEC Community</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        this.windows.push(window);
        this.focusWindow(window);
    }
    
    openAboutWindow() {
        const window = this.createWindow({
            title: 'Sobre ADRA-TEC OS',
            icon: 'fas fa-info-circle',
            color: '#00d4ff'
        });
        
        window.element.querySelector('.window-content').innerHTML = `
            <div class="about-dashboard">
                <div class="about-header">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>ADRA-TEC OS</h3>
                    <p>Sistema Operacional Educacional</p>
                    <span class="version">Versão 1.0.0</span>
                </div>
                <div class="about-content">
                    <p>ADRA-TEC OS é um sistema operacional educacional inovador projetado para transformar o aprendizado em uma experiência imersiva e interativa.</p>
                    
                    <h4>Características Principais</h4>
                    <ul>
                        <li>Interface de sistema operacional completa</li>
                        <li>Módulos educacionais integrados</li>
                        <li>Sistema de gamificação e conquistas</li>
                        <li>Banco de dados local para progresso</li>
                        <li>Ambiente de aprendizado colaborativo</li>
                    </ul>
                    
                    <h4>Módulos Disponíveis</h4>
                    <div class="modules-list">
                        <div class="module-item">
                            <i class="fas fa-briefcase"></i>
                            <span>Administrativo - ${this.userData.progress.modules.administrativo.progress}% Completo</span>
                        </div>
                        <div class="module-item">
                            <i class="fas fa-rocket"></i>
                            <span>Empreendedorismo - Em desenvolvimento</span>
                        </div>
                        <div class="module-item">
                            <i class="fas fa-bullhorn"></i>
                            <span>Marketing - Em desenvolvimento</span>
                        </div>
                        <div class="module-item">
                            <i class="fas fa-code"></i>
                            <span>Programação - Em desenvolvimento</span>
                        </div>
                    </div>
                    
                    <div class="about-footer">
                        <p>&copy; 2026 ADRA-TEC. Todos os direitos reservados.</p>
                        <p>Educação Profissional Transformadora</p>
                    </div>
                </div>
            </div>
        `;
        
        this.windows.push(window);
        this.focusWindow(window);
    }
    
    // Sistema de janelas completo
    setupWindowDragging() {
        document.addEventListener('mousedown', (e) => {
            const header = e.target.closest('.window-header');
            if (header && !e.target.closest('.window-controls')) {
                const window = header.closest('.os-window');
                this.startDragging(window, e);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.currentWindow) {
                this.dragWindow(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.stopDragging();
        });
    }
    
    startDragging(window, e) {
        this.isDragging = true;
        this.currentWindow = window;
        
        const rect = window.getBoundingClientRect();
        this.offset.x = e.clientX - rect.left;
        this.offset.y = e.clientY - rect.top;
        
        window.style.zIndex = this.getHighestZIndex() + 1;
    }
    
    dragWindow(e) {
        if (!this.currentWindow) return;
        
        const x = e.clientX - this.offset.x;
        const y = e.clientY - this.offset.y;
        
        // Limitar à tela
        const maxX = window.innerWidth - this.currentWindow.offsetWidth;
        const maxY = window.innerHeight - this.currentWindow.offsetHeight;
        
        this.currentWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.currentWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }
    
    stopDragging() {
        this.isDragging = false;
        this.currentWindow = null;
    }
    
    getHighestZIndex() {
        const windows = document.querySelectorAll('.os-window');
        let highest = 100;
        windows.forEach(window => {
            const z = parseInt(window.style.zIndex) || 0;
            if (z > highest) highest = z;
        });
        return highest;
    }

    getWindowData(windowElement) {
        return this.windows.find(window => window.element === windowElement);
    }
    
    focusWindow(window) {
        // Remover foco de outras janelas
        this.windows.forEach(w => {
            w.element.classList.remove('focused');
        });
        
        // Adicionar foco à janela atual
        window.element.classList.add('focused');
        window.element.style.zIndex = this.getHighestZIndex() + 1;
        this.activeWindow = window;
        
        // Atualizar tab na barra de tarefas
        this.updateWindowTabs();
    }
    
    closeWindow(window) {
        const index = this.windows.findIndex(w => w.element === window.element || w.id === window.id);
        if (index > -1) {
            this.windows.splice(index, 1);
            window.element.remove();
            this.updateWindowTabs();
        }
    }
    
    minimizeWindow(window) {
        window.minimized = true;
        window.element.style.display = 'none';
        this.updateWindowTabs();
    }
    
    maximizeWindow(window) {
        if (window.maximized) {
            // Restaurar tamanho original
            window.element.style.width = '800px';
            window.element.style.height = '600px';
            window.maximized = false;
        } else {
            // Maximizar
            window.element.style.width = '100%';
            window.element.style.height = 'calc(100% - 60px)';
            window.element.style.top = '0';
            window.element.style.left = '0';
            window.maximized = true;
        }
    }
    
    closeAllWindows() {
        this.windows.forEach(window => {
            window.element.remove();
        });
        this.windows = [];
        this.updateWindowTabs();
    }
    
    addWindowTab(title, window) {
        const tabsContainer = document.querySelector('.window-tabs');
        const tab = document.createElement('div');
        tab.className = 'window-tab';
        if (window.minimized) {
            tab.classList.add('minimized');
        }
        tab.innerHTML = `
            <i class="fas fa-window-maximize"></i>
            <span>${title}</span>
        `;
        
        tab.addEventListener('click', () => {
            if (window.minimized) {
                window.minimized = false;
                window.element.style.display = 'flex';
                this.focusWindow(window);
            } else {
                this.focusWindow(window);
            }
        });
        
        tabsContainer.appendChild(tab);
    }
    
    updateWindowTabs() {
        const tabsContainer = document.querySelector('.window-tabs');
        tabsContainer.innerHTML = '';
        
        this.windows.forEach(window => {
            this.addWindowTab(window.title, window);
        });
    }
    
    toggleNotificationPanel() {
        this.notificationPanel.classList.toggle('active');
    }
    
    closeNotificationPanel() {
        this.notificationPanel.classList.remove('active');
    }
    
    updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        this.clock.textContent = `${hours}:${minutes}`;
    }
    
    // Sistema de Banco de Dados
    saveDatabase() {
        const dbData = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            userData: this.userData
        };
        
        const dataStr = JSON.stringify(dbData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'text/plain' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `adra-tec-backup-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        
        this.showNotification('Banco de dados salvo com sucesso!', 'success');
    }
    
    loadDatabase(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const dbData = JSON.parse(e.target.result);
                
                // Validar dados
                if (!dbData.userData) {
                    throw new Error('Formato de banco de dados inválido');
                }
                
                // Confirmar importação
                if (confirm('Deseja importar este banco de dados? Seus dados atuais serão substituídos.')) {
                    this.userData = dbData.userData;
                    this.saveUserData();
                    this.showNotification('Banco de dados carregado com sucesso!', 'success');
                    
                    // Atualizar interface
                    this.updateInterface();
                }
            } catch (error) {
                this.showNotification('Erro ao carregar banco de dados: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
        
        // Limpar input
        event.target.value = '';
    }
    
    saveUserData() {
        const data = {
            userData: this.userData,
            timestamp: new Date().toISOString()
        };
        
        // Salvar em localStorage
        localStorage.setItem('adra-tec-user-data', JSON.stringify(data));
        
        // Salvar em cookies (backup)
        const cookieData = btoa(JSON.stringify(data));
        document.cookie = `adra-tec-data=${cookieData}; max-age=31536000; path=/`;
    }
    
    loadSavedData() {
        // Tentar carregar do localStorage primeiro
        const localData = localStorage.getItem('adra-tec-user-data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                this.userData = data.userData || this.userData;
                return;
            } catch (e) {
                console.error('Erro ao carregar dados do localStorage:', e);
            }
        }
        
        // Tentar carregar dos cookies
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'adra-tec-data') {
                try {
                    const data = JSON.parse(atob(value));
                    this.userData = data.userData || this.userData;
                    return;
                } catch (e) {
                    console.error('Erro ao carregar dados dos cookies:', e);
                }
            }
        }
    }
    
    updateInterface() {
        // Atualizar nome de usuário
        const displayName = this.userData.accessType === 'dupla' 
            ? `${this.userData.name} e ${this.userData.name2}`
            : this.userData.name;
        
        const menuUsername = document.getElementById('menu-username');
        if (menuUsername) menuUsername.textContent = displayName;
        
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) welcomeMessage.textContent = `Bem-vindo(a), ${displayName}!`;
    }
    
    updateModuleProgress(moduleId) {
        // Simular progresso (implementação real viria do conteúdo do módulo)
        const progress = Math.min(100, this.userData.progress.modules[moduleId].progress + 5);
        this.userData.progress.modules[moduleId].progress = progress;
        
        if (progress === 100 && !this.userData.progress.modules[moduleId].completed.includes('completed')) {
            this.userData.progress.modules[moduleId].completed.push('completed');
            this.unlockAchievement({
                id: `module-${moduleId}-completed`,
                name: `${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} Completo`,
                description: `Você completou 100% do módulo ${moduleId}`,
                icon: 'fas fa-trophy'
            });
        }
        
        this.saveUserData();
    }
    
    unlockAchievement(achievement) {
        if (!this.userData.progress.achievements.find(a => a.id === achievement.id)) {
            this.userData.progress.achievements.push(achievement);
            this.showNotification(`Nova conquista: ${achievement.name}!`, 'achievement');
            this.saveUserData();
        }
    }
    
    showWelcomeNotification() {
        setTimeout(() => {
            this.showNotification(`Bem-vindo(a) ao ADRA-TEC OS!`, 'success');
        }, 3500);
    }
    
    showNotification(message, type = 'info') {
        // Adicionar ao painel de notificações
        const notificationsList = document.querySelector('.notifications-list');
        if (notificationsList) {
            const notification = document.createElement('div');
            notification.className = 'notification-item';
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <div>
                    <strong>${type === 'success' ? 'Sucesso!' : type === 'error' ? 'Erro!' : 'Informação'}</strong>
                    <p>${message}</p>
                    <span class="notification-time">Agora</span>
                </div>
            `;
            
            notificationsList.insertBefore(notification, notificationsList.firstChild);
            
            // Limitar a 10 notificações
            while (notificationsList.children.length > 10) {
                notificationsList.removeChild(notificationsList.lastChild);
            }
        }
        
        // Atualizar badge
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
        }
        
        console.log(`Notificação: ${message}`);
    }
    
    saveSettings() {
        const nameInput = document.getElementById('settings-name');
        const name2Input = document.getElementById('settings-name2');
        
        if (nameInput) {
            this.userData.name = nameInput.value.trim();
        }
        
        if (name2Input) {
            this.userData.name2 = name2Input.value.trim();
        }
        
        this.saveUserData();
        this.updateInterface();
        this.showNotification('Configurações salvas com sucesso!', 'success');
    }
    
    logout() {
        if (confirm('Deseja realmente sair do ADRA-TEC OS? Seu progresso será salvo automaticamente.')) {
            // Salvar dados
            this.saveUserData();
            
            // Animação de desligamento
            this.bootScreen.style.display = 'flex';
            this.bootScreen.classList.remove('hidden');
            this.desktop.classList.add('hidden');
            this.taskbar.classList.add('hidden');
            
            const bootMessages = this.bootScreen.querySelector('.boot-messages');
            bootMessages.innerHTML = `
                <div class="boot-message">Desligando sistema...</div>
                <div class="boot-message">Salvando configurações...</div>
                <div class="boot-message">Encerrando sessão...</div>
                <div class="boot-message"> Sistema desligado. Até logo!</div>
            `;
            
            setTimeout(() => {
                // Resetar para tela de login
                this.bootScreen.classList.add('hidden');
                this.osSystem.classList.add('hidden');
                this.loginScreen.classList.remove('hidden');
                
                // Limpar campos
                document.getElementById('student-name').value = '';
                document.getElementById('student-name-2').value = '';
                
                // Resetar tipo de acesso
                document.querySelectorAll('.access-type-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector('.access-type-btn[data-type="individual"]').classList.add('active');
                this.userData.accessType = 'individual';
                this.updateNameLabels();
            }, 3000);
        }
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.osManager = new OSTecManager();
});

// Adicionar CSS adicional para login e funcionalidades
const additionalStyles = `
    /* Estilos para login */
    .login-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    
    .login-container {
        background: rgba(40, 40, 40, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 40px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .login-header {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .login-header .logo i {
        font-size: 3rem;
        color: #00d4ff;
        margin-bottom: 15px;
        display: block;
    }
    
    .login-header h1 {
        color: white;
        font-size: 2rem;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    
    .login-subtitle {
        color: rgba(255, 255, 255, 0.8);
        margin-top: 5px;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-label {
        display: block;
        color: white;
        font-weight: 600;
        margin-bottom: 8px;
    }
    
    .access-type-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }
    
    .access-type-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .access-type-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .access-type-btn.active {
        background: linear-gradient(135deg, #00d4ff, #00ff88);
        border-color: #00d4ff;
        color: white;
    }
    
    .form-input {
        width: 100%;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
        font-size: 1rem;
    }
    
    .form-input:focus {
        outline: none;
        border-color: #00d4ff;
    }
    
    .db-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #ffd700, #ff8c00);
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .db-btn:hover {
        transform: translateY(-2px);
    }
    
    .db-info {
        margin-top: 10px;
        text-align: center;
    }
    
    .db-info small {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.85rem;
    }
    
    .hidden {
        display: none !important;
    }
    
    /* Melhorias nos controles de janela */
    .window-control {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        cursor: pointer;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
    }
    
    .window-control:hover {
        opacity: 0.8;
    }
    
    .window-control.close {
        background: #ff5f56;
    }
    
    .window-control.minimize {
        background: #ffbd2e;
    }
    
    .window-control.maximize {
        background: #27c93f;
    }
    
    .os-window.focused {
        box-shadow: 0 15px 50px rgba(0, 212, 255, 0.3);
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

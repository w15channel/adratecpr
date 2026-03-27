// ADRA-TEC OS - Sistema Operacional Educacional
class OSTecManager {
    constructor() {
        this.bootScreen = document.getElementById('boot-screen');
        this.desktop = document.getElementById('desktop');
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
        
        this.init();
    }
    
    init() {
        // Iniciar boot sequence
        this.startBootSequence();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Iniciar clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Carregar dados do usuário
        this.loadUserData();
    }
    
    startBootSequence() {
        setTimeout(() => {
            this.bootScreen.style.opacity = '0';
            setTimeout(() => {
                this.bootScreen.style.display = 'none';
                this.desktop.style.display = 'block';
                this.showWelcomeNotification();
            }, 500);
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
            icon.addEventListener('dblclick', () => {
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
                } else if (item.id === 'shutdown-btn') {
                    this.shutdown();
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
        
        // Sistema de janelas
        this.setupWindowDragging();
        
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
        
        // Carregar conteúdo do módulo
        this.loadModuleContent(window, moduleId);
        
        this.windows.push(window);
        this.focusWindow(window);
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
                    <div class="window-control minimize"></div>
                    <div class="window-control maximize"></div>
                    <div class="window-control close"></div>
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
        
        // Configurar controles da janela
        const closeBtn = window.querySelector('.window-control.close');
        const minimizeBtn = window.querySelector('.window-control.minimize');
        const maximizeBtn = window.querySelector('.window-control.maximize');
        
        closeBtn.addEventListener('click', () => this.closeWindow(window));
        minimizeBtn.addEventListener('click', () => this.minimizeWindow(window));
        maximizeBtn.addEventListener('click', () => this.maximizeWindow(window));
        
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
    
    loadModuleContent(window, moduleId) {
        const content = window.element.querySelector('.window-content');
        
        // Mapeamento de módulos para páginas
        const modulePages = {
            administrativo: 'course-view.html',
            empreendedorismo: 'empreendedorismo-view.html',
            marketing: 'marketing-view.html',
            programacao: 'programacao-view.html'
        };
        
        const page = modulePages[moduleId];
        
        if (page === 'course-view.html') {
            // Carregar o módulo administrativo existente
            fetch(page)
                .then(response => response.text())
                .then(html => {
                    content.innerHTML = html;
                    
                    // Inicializar o course manager se necessário
                    if (window.courseManager) {
                        window.courseManager.init();
                    }
                    
                    // Adicionar script do course manager
                    const script = document.createElement('script');
                    script.src = 'js/course-manager.js';
                    content.appendChild(script);
                })
                .catch(error => {
                    content.innerHTML = this.getModulePlaceholder(moduleId);
                });
        } else {
            // Para outros módulos, mostrar placeholder
            content.innerHTML = this.getModulePlaceholder(moduleId);
        }
    }
    
    getModulePlaceholder(moduleId) {
        const placeholders = {
            administrativo: `
                <div class="module-placeholder">
                    <i class="fas fa-briefcase"></i>
                    <h3>Módulo Administrativo</h3>
                    <p>Gestão, organização e eficiência empresarial</p>
                    <div class="module-stats">
                        <div class="stat">
                            <span class="stat-number">12</span>
                            <span class="stat-label">Capítulos</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">1.410</span>
                            <span class="stat-label">XP Total</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">100%</span>
                            <span class="stat-label">Completo</span>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="window.location.href='course-view.html'">
                        <i class="fas fa-play"></i> Iniciar Módulo
                    </button>
                </div>
            `,
            empreendedorismo: `
                <div class="module-placeholder">
                    <i class="fas fa-rocket"></i>
                    <h3>Módulo Empreendedorismo</h3>
                    <p>Transforme ideias em negócios de sucesso</p>
                    <div class="coming-soon">
                        <i class="fas fa-tools"></i>
                        <p>Em desenvolvimento...</p>
                        <small>Conteúdo disponível em breve!</small>
                    </div>
                </div>
            `,
            marketing: `
                <div class="module-placeholder">
                    <i class="fas fa-bullhorn"></i>
                    <h3>Módulo Marketing</h3>
                    <p>Estratégias, comunicação e crescimento</p>
                    <div class="coming-soon">
                        <i class="fas fa-tools"></i>
                        <p>Em desenvolvimento...</p>
                        <small>Conteúdo disponível em breve!</small>
                    </div>
                </div>
            `,
            programacao: `
                <div class="module-placeholder">
                    <i class="fas fa-code"></i>
                    <h3>Módulo Programação</h3>
                    <p>Desenvolvimento de software e tecnologia</p>
                    <div class="coming-soon">
                        <i class="fas fa-tools"></i>
                        <p>Em desenvolvimento...</p>
                        <small>Conteúdo disponível em breve!</small>
                    </div>
                </div>
            `
        };
        
        return placeholders[moduleId] || placeholders.administrativo;
    }
    
    openTool(tool) {
        switch(tool) {
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
                            <span class="card-number">24h</span>
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
                            <div class="progress-fill" style="width: 100%"></div>
                        </div>
                        <span>100%</span>
                    </div>
                    <div class="progress-item">
                        <span>Empreendedorismo</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span>0%</span>
                    </div>
                    <div class="progress-item">
                        <span>Marketing</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span>0%</span>
                    </div>
                    <div class="progress-item">
                        <span>Programação</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span>0%</span>
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
        
        window.element.querySelector('.window-content').innerHTML = `
            <div class="achievements-dashboard">
                <h3>Suas Conquistas</h3>
                <div class="achievements-grid">
                    <div class="achievement unlocked">
                        <i class="fas fa-trophy"></i>
                        <div>
                            <strong>Administrador Certificado</strong>
                            <p>Completou todo o módulo administrativo</p>
                        </div>
                    </div>
                    <div class="achievement unlocked">
                        <i class="fas fa-star"></i>
                        <div>
                            <strong>Primeiros Passos</strong>
                            <p>Iniciou sua jornada no ADRA-TEC</p>
                        </div>
                    </div>
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
                    <div class="settings-section">
                        <h4>Sistema</h4>
                        <div class="setting-item">
                            <label>Idioma</label>
                            <select>
                                <option>Português (Brasil)</option>
                                <option>Inglês</option>
                                <option>Espanhol</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" checked> Animações
                            </label>
                        </div>
                    </div>
                </div>
                <div class="settings-actions">
                    <button class="btn-primary">Salvar Configurações</button>
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
                            <li>Duplo clique nos ícones para abrir módulos</li>
                            <li>Use o Menu Iniciar para acessar todas as ferramentas</li>
                            <li>Arraste as janelas para reorganizar</li>
                            <li>Pressione ESC para fechar menus</li>
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
                        <li>Ambiente de aprendizado colaborativo</li>
                    </ul>
                    
                    <h4>Módulos Disponíveis</h4>
                    <div class="modules-list">
                        <div class="module-item">
                            <i class="fas fa-briefcase"></i>
                            <span>Administrativo - 100% Completo</span>
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
    
    setupWindowDragging() {
        document.addEventListener('mousedown', (e) => {
            const header = e.target.closest('.window-header');
            if (header) {
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
        const index = this.windows.findIndex(w => w.id === window.id);
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
            if (!window.minimized) {
                this.addWindowTab(window.title, window);
            }
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
    
    loadUserData() {
        // Carregar dados do usuário do localStorage
        const userData = localStorage.getItem('adra-tec_user_data');
        if (userData) {
            const data = JSON.parse(userData);
            // Atualizar interface com dados do usuário
        }
    }
    
    showWelcomeNotification() {
        // Mostrar notificação de boas-vindas
        setTimeout(() => {
            this.showNotification('Bem-vindo ao ADRA-TEC OS!', 'Sistema operacional educacional pronto para uso.');
        }, 3500);
    }
    
    showNotification(title, message) {
        // Implementar sistema de notificações toast
        console.log(`Notificação: ${title} - ${message}`);
    }
    
    shutdown() {
        if (confirm('Deseja realmente sair do ADRA-TEC OS?')) {
            // Animação de desligamento
            this.bootScreen.style.display = 'flex';
            this.bootScreen.style.opacity = '1';
            
            const bootMessages = this.bootScreen.querySelector('.boot-messages');
            bootMessages.innerHTML = `
                <div class="boot-message">Desligando sistema...</div>
                <div class="boot-message">Salvando configurações...</div>
                <div class="boot-message">Encerrando sessão...</div>
                <div class="boot-message"> Sistema desligado. Até logo!</div>
            `;
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.osManager = new OSTecManager();
});

// Estilos adicionais para componentes dinâmicos
const additionalStyles = `
    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .loading-content i {
        font-size: 2rem;
        margin-bottom: 15px;
        color: #00d4ff;
    }
    
    .module-placeholder {
        text-align: center;
        padding: 40px;
    }
    
    .module-placeholder i {
        font-size: 4rem;
        color: #00d4ff;
        margin-bottom: 20px;
    }
    
    .module-placeholder h3 {
        color: white;
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    
    .module-placeholder p {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 30px;
    }
    
    .module-stats {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-bottom: 30px;
    }
    
    .stat {
        text-align: center;
    }
    
    .stat-number {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: #00d4ff;
    }
    
    .stat-label {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.6);
    }
    
    .coming-soon {
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
    }
    
    .coming-soon i {
        font-size: 2rem;
        color: #ffd700;
        margin-bottom: 10px;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #00d4ff, #00ff88);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
    }
    
    .progress-dashboard, .achievements-dashboard, .settings-dashboard, .help-dashboard, .about-dashboard {
        padding: 20px;
    }
    
    .progress-dashboard h3, .achievements-dashboard h3, .settings-dashboard h3 {
        color: white;
        margin-bottom: 25px;
        font-size: 1.3rem;
    }
    
    .progress-overview {
        display: flex;
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .overview-card {
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 8px;
        text-align: center;
    }
    
    .overview-card i {
        font-size: 2rem;
        color: #00d4ff;
        margin-bottom: 10px;
    }
    
    .card-number {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
    }
    
    .card-label {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.6);
    }
    
    .module-progress h4 {
        color: white;
        margin-bottom: 15px;
    }
    
    .progress-item {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
    }
    
    .progress-item span:first-child {
        color: white;
        min-width: 120px;
    }
    
    .progress-item .progress-bar {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-item .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00d4ff, #00ff88);
    }
    
    .progress-item span:last-child {
        color: rgba(255, 255, 255, 0.7);
        min-width: 40px;
        text-align: right;
    }
    
    .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }
    
    .achievement {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
    }
    
    .achievement.unlocked {
        border: 1px solid rgba(0, 212, 255, 0.3);
    }
    
    .achievement.locked {
        opacity: 0.5;
    }
    
    .achievement i {
        font-size: 2rem;
    }
    
    .achievement.unlocked i {
        color: #ffd700;
    }
    
    .achievement.locked i {
        color: rgba(255, 255, 255, 0.3);
    }
    
    .achievement strong {
        color: white;
        display: block;
        margin-bottom: 5px;
    }
    
    .achievement p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
    }
    
    .settings-sections {
        display: grid;
        gap: 30px;
    }
    
    .settings-section h4 {
        color: #00d4ff;
        margin-bottom: 15px;
    }
    
    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .setting-item label {
        color: white;
    }
    
    .setting-item select,
    .setting-item input[type="range"] {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
    }
    
    .settings-actions {
        display: flex;
        gap: 15px;
        margin-top: 30px;
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .help-sections {
        display: grid;
        gap: 30px;
    }
    
    .help-section h4 {
        color: #00d4ff;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .help-section ul {
        list-style: none;
    }
    
    .help-section li {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 8px;
        padding-left: 15px;
        position: relative;
    }
    
    .help-section li:before {
        content: "•";
        color: #00d4ff;
        position: absolute;
        left: 0;
    }
    
    kbd {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 0.8rem;
    }
    
    .about-header {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .about-header i {
        font-size: 4rem;
        color: #00d4ff;
        margin-bottom: 15px;
    }
    
    .about-header h3 {
        color: white;
        font-size: 1.8rem;
        margin-bottom: 5px;
    }
    
    .about-header p {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 10px;
    }
    
    .version {
        color: #00d4ff;
        font-weight: 600;
    }
    
    .about-content h4 {
        color: white;
        margin: 25px 0 15px;
    }
    
    .about-content p {
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
        margin-bottom: 15px;
    }
    
    .modules-list {
        margin: 20px 0;
    }
    
    .module-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        color: rgba(255, 255, 255, 0.8);
    }
    
    .module-item i {
        color: #00d4ff;
    }
    
    .about-footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
    }
    
    .about-footer p {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

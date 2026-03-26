// Componente Header para ADRA-TEC
export class Header {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.user = null;
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.loadUserData();
    }

    render() {
        this.container.innerHTML = `
            <header class="header">
                <div class="container header-content">
                    <div class="logo">
                        <div class="logo-icon">🚀</div>
                        <div>
                            <h1>ADRA-TEC</h1>
                            <p>Portal de Educação Profissional</p>
                        </div>
                    </div>

                    <nav class="nav">
                        <a href="#" class="nav-link active" data-view="dashboard">
                            <i class="fas fa-home"></i>
                            Dashboard
                        </a>
                        <a href="#" class="nav-link" data-view="modules">
                            <i class="fas fa-book"></i>
                            Módulos
                        </a>
                        <a href="#" class="nav-link" data-view="progress">
                            <i class="fas fa-chart-line"></i>
                            Progresso
                        </a>
                        <a href="#" class="nav-link" data-view="community">
                            <i class="fas fa-users"></i>
                            Comunidade
                        </a>
                    </nav>

                    <div class="user-actions">
                        <button class="btn btn-secondary" onclick="window.openIATutor()">
                            <i class="fas fa-robot"></i>
                            IA Tutor
                        </button>
                        
                        <div class="user-info" onclick="this.classList.toggle('active')">
                            <div class="user-avatar" id="header-avatar">🎯</div>
                            <div class="user-details">
                                <span class="user-name" id="header-name">Carregando...</span>
                                <span class="user-points" id="header-points">0 pts</span>
                            </div>
                            <div class="user-dropdown">
                                <a href="#" onclick="window.showProfile()">
                                    <i class="fas fa-user"></i>
                                    Perfil
                                </a>
                                <a href="#" onclick="window.showSettings()">
                                    <i class="fas fa-cog"></i>
                                    Configurações
                                </a>
                                <a href="#" onclick="window.logout()">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Sair
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    setupEventListeners() {
        // Navigation links
        this.container.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const viewId = link.dataset.view;
                if (window.NavigationManager) {
                    window.NavigationManager.showView(viewId);
                } else {
                    // Fallback simples
                    document.querySelectorAll('.view').forEach(view => {
                        view.classList.add('hidden');
                    });
                    const targetView = document.getElementById(`${viewId}-view`);
                    if (targetView) {
                        targetView.classList.remove('hidden');
                    }
                    
                    // Atualizar links ativos
                    this.container.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    link.classList.add('active');
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const userInfo = this.container.querySelector('.user-info');
            if (userInfo && !userInfo.contains(e.target)) {
                userInfo.classList.remove('active');
            }
        });
    }

    loadUserData() {
        const savedUser = localStorage.getItem('adra-tec_user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.updateUserInfo();
        }
    }

    updateUserInfo() {
        if (!this.user) return;

        const avatar = this.container.querySelector('#header-avatar');
        const name = this.container.querySelector('#header-name');
        const points = this.container.querySelector('#header-points');

        if (avatar) avatar.textContent = this.user.avatar || '🎯';
        if (name) name.textContent = this.user.name || 'Estudante';
        if (points) points.textContent = `${this.user.points || 0} pts`;
    }

    updateUser(user) {
        this.user = user;
        this.updateUserInfo();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-fadeIn`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

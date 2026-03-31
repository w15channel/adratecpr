// SISTEMA ADMINISTRATIVO ADRA-TEC
// Funções para gerenciamento administrativo do conteúdo

class AdminManager {
    constructor(config) {
        this.config = config;
        this.apiKeys = config.keys;
        this.validationRules = config.validation;
    }

    // Autenticação administrativa
    async authenticateAdmin(credentials) {
        // Implementar autenticação real
        if (credentials.username === 'admin' && credentials.password === 'adra123') {
            return {
                success: true,
                token: this.generateAdminToken(),
                permissions: ['read', 'write', 'delete', 'manage_users'],
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
            };
        }
        
        return {
            success: false,
            error: "Credenciais inválidas"
        };
    }

    // Gerar token administrativo
    generateAdminToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let token = '';
        for (let i = 0; i < 64; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    // Validar token administrativo
    validateAdminToken(token) {
        // Implementar validação real do token
        return {
            valid: true,
            permissions: ['read', 'write', 'delete', 'manage_users']
        };
    }

    // ===== GERENCIAMENTO DE CAPÍTULOS =====

    // Listar todos os capítulos
    async listChapters() {
        try {
            const response = await fetch('/content/chapters');
            const chapters = await response.json();
            return {
                success: true,
                data: chapters.sort((a, b) => a.order - b.order)
            };
        } catch (error) {
            return {
                success: false,
                error: "Erro ao carregar capítulos: " + error.message
            };
        }
    }

    // Obter capítulo específico
    async getChapter(chapterId) {
        try {
            const response = await fetch(`/content/chapters/capitulo-${chapterId.toString().padStart(2, '0')}.json`);
            const chapter = await response.json();
            return {
                success: true,
                data: chapter
            };
        } catch (error) {
            return {
                success: false,
                error: "Erro ao carregar capítulo: " + error.message
            };
        }
    }

    // Atualizar capítulo
    async updateChapter(chapterId, chapterData) {
        try {
            // Validar dados do capítulo
            const validation = this.validateChapterData(chapterData);
            if (!validation.valid) {
                return {
                    success: false,
                    error: "Dados inválidos: " + validation.errors.join(', ')
                };
            }

            // Implementar atualização real via API
            const response = await fetch(`/api/admin/chapters/${chapterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${chapterData.adminToken}`
                },
                body: JSON.stringify(chapterData)
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return {
                success: false,
                error: "Erro ao atualizar capítulo: " + error.message
            };
        }
    }

    // Validar dados do capítulo
    validateChapterData(data) {
        const errors = [];
        
        if (!data.title || data.title.trim() === '') {
            errors.push("Título é obrigatório");
        }
        
        if (!data.theory || !data.theory.content || data.theory.content.length === 0) {
            errors.push("Conteúdo teórico é obrigatório");
        }
        
        if (!data.simulations || data.simulations.length !== 5) {
            errors.push("Exatamente 5 simulações são obrigatórias");
        }
        
        if (!data.assessment || !data.assessment.quiz || data.assessment.quiz.length !== 5) {
            errors.push("Exatamente 5 questões no quiz são obrigatórias");
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // ===== GERENCIAMENTO DE SIMULAÇÕES =====

    // Listar configurações de simulações
    async listSimulationConfigs() {
        try {
            const apps = ['outlook', 'excel', 'word', 'trello', 'erp'];
            const configs = {};
            
            for (const app of apps) {
                const response = await fetch(`/content/simulations/${app}.json`);
                configs[app] = await response.json();
            }
            
            return {
                success: true,
                data: configs
            };
        } catch (error) {
            return {
                success: false,
                error: "Erro ao carregar configurações: " + error.message
            };
        }
    }

    // Atualizar configuração de simulação
    async updateSimulationConfig(appId, configData) {
        try {
            const validation = this.validateSimulationConfig(configData);
            if (!validation.valid) {
                return {
                    success: false,
                    error: "Configuração inválida: " + validation.errors.join(', ')
                };
            }

            // Implementar atualização real
            const response = await fetch(`/api/admin/simulations/${appId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${configData.adminToken}`
                },
                body: JSON.stringify(configData)
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: "Erro ao atualizar configuração: " + error.message
            };
        }
    }

    // Validar configuração de simulação
    validateSimulationConfig(config) {
        const errors = [];
        
        if (!config.name || config.name.trim() === '') {
            errors.push("Nome é obrigatório");
        }
        
        if (!config.color || !/^#[0-9A-Fa-f]{6}$/.test(config.color)) {
            errors.push("Cor inválida (use formato #RRGGBB)");
        }
        
        if (!config.validation_rules) {
            errors.push("Regras de validação são obrigatórias");
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // ===== GERENCIAMENTO DE CONFIGURAÇÕES =====

    // Obter configurações do sistema
    async getSystemConfig() {
        try {
            const configs = {};
            const configFiles = ['keys', 'environment', 'validation', 'ui-config'];
            
            for (const file of configFiles) {
                const response = await fetch(`/config/${file}.json`);
                configs[file] = await response.json();
            }
            
            return {
                success: true,
                data: configs
            };
        } catch (error) {
            return {
                success: false,
                error: "Erro ao carregar configurações: " + error.message
            };
        }
    }

    // Atualizar configuração do sistema
    async updateSystemConfig(configType, configData) {
        try {
            const validation = this.validateSystemConfig(configType, configData);
            if (!validation.valid) {
                return {
                    success: false,
                    error: "Configuração inválida: " + validation.errors.join(', ')
                };
            }

            const response = await fetch(`/api/admin/config/${configType}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${configData.adminToken}`
                },
                body: JSON.stringify(configData)
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: "Erro ao atualizar configuração: " + error.message
            };
        }
    }

    // Validar configuração do sistema
    validateSystemConfig(configType, config) {
        const errors = [];
        
        switch (configType) {
            case 'environment':
                if (!config.system || !config.system.name) {
                    errors.push("Nome do sistema é obrigatório");
                }
                break;
            case 'ui-config':
                if (!config.theme || !config.theme.primary_color) {
                    errors.push("Cor primária é obrigatória");
                }
                break;
            case 'validation':
                if (!config.quiz || typeof config.quiz.passing_score !== 'number') {
                    errors.push("Configuração de quiz inválida");
                }
                break;
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // ===== RELATÓRIOS E MONITORAMENTO =====

    // Obter estatísticas gerais
    async getSystemStats() {
        try {
            const response = await fetch('/api/admin/stats');
            const stats = await response.json();
            
            return {
                success: true,
                data: {
                    totalUsers: stats.totalUsers || 0,
                    activeUsers: stats.activeUsers || 0,
                    averageProgress: stats.averageProgress || 0,
                    completionRate: stats.completionRate || 0,
                    popularChapters: stats.popularChapters || [],
                    recentActivity: stats.recentActivity || []
                }
            };
        } catch (error) {
            return {
                success: false,
                error: "Erro ao carregar estatísticas: " + error.message
            };
        }
    }

    // Obter progresso dos usuários
    async getUserProgress(userId = null) {
        try {
            const url = userId ? `/api/admin/users/${userId}/progress` : '/api/admin/users/progress';
            const response = await fetch(url);
            const progress = await response.json();
            
            return {
                success: true,
                data: progress
            };
        } catch (error) {
            return {
                success: false,
                error: "Erro ao carregar progresso: " + error.message
            };
        }
    }

    // ===== BACKUP E RESTAURAÇÃO =====

    // Criar backup do sistema
    async createBackup() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                version: this.config.system.version,
                chapters: await this.listChapters(),
                simulations: await this.listSimulationConfigs(),
                systemConfig: await this.getSystemConfig()
            };

            return {
                success: true,
                data: backup,
                filename: `adra-tec-backup-${new Date().toISOString().split('T')[0]}.json`
            };
        } catch (error) {
            return {
                success: false,
                error: "Erro ao criar backup: " + error.message
            };
        }
    }

    // Restaurar backup
    async restoreBackup(backupData) {
        try {
            // Validar estrutura do backup
            if (!backupData.version || !backupData.chapters || !backupData.simulations) {
                return {
                    success: false,
                    error: "Formato de backup inválido"
                };
            }

            // Implementar restauração real
            const response = await fetch('/api/admin/restore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${backupData.adminToken}`
                },
                body: JSON.stringify(backupData)
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: "Erro ao restaurar backup: " + error.message
            };
        }
    }
}

// Exportar para uso no sistema principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminManager;
}

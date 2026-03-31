// CARREGADOR DE CONFIGURAÇÕES ADRA-TEC
// Sistema centralizado para carregar e gerenciar configurações

class ConfigLoader {
    constructor() {
        this.config = {};
        this.loaded = false;
        this.cache = new Map();
    }

    // Carregar todas as configurações
    async loadAllConfigs() {
        try {
            console.log('Carregando configurações do ADRA-TEC...');
            
            // Carregar configurações do sistema
            await this.loadSystemConfigs();
            
            // Carregar conteúdo dos capítulos
            await this.loadChaptersContent();
            
            // Carregar configurações das simulações
            await this.loadSimulationConfigs();
            
            this.loaded = true;
            console.log('Configurações carregadas com sucesso!');
            
            return this.config;
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            throw error;
        }
    }

    // Carregar configurações do sistema
    async loadSystemConfigs() {
        const configFiles = ['keys', 'environment', 'validation', 'ui-config'];
        
        for (const file of configFiles) {
            try {
                const response = await fetch(`/config/${file}.json`);
                const config = await response.json();
                this.config[file] = config;
                
                // Aplicar configurações globais
                if (file === 'environment') {
                    this.applyEnvironmentConfig(config);
                }
                
                console.log(`✅ ${file}.json carregado`);
            } catch (error) {
                console.error(`❌ Erro ao carregar ${file}.json:`, error);
                throw new Error(`Falha ao carregar configuração: ${file}`);
            }
        }
    }

    // Carregar conteúdo dos capítulos
    async loadChaptersContent() {
        try {
            const chapters = [];
            
            // Carregar todos os 12 capítulos
            for (let i = 1; i <= 12; i++) {
                const chapterId = i.toString().padStart(2, '0');
                const response = await fetch(`/content/chapters/capitulo-${chapterId}.json`);
                const chapter = await response.json();
                chapters.push(chapter);
                
                console.log(`✅ Capítulo ${chapterId} carregado`);
            }
            
            this.config.chapters = chapters;
        } catch (error) {
            console.error('❌ Erro ao carregar capítulos:', error);
            throw new Error('Falha ao carregar conteúdo dos capítulos');
        }
    }

    // Carregar configurações das simulações
    async loadSimulationConfigs() {
        try {
            const apps = ['outlook', 'excel', 'word', 'trello', 'erp'];
            const simulations = {};
            
            for (const app of apps) {
                const response = await fetch(`/content/simulations/${app}.json`);
                const config = await response.json();
                simulations[app] = config;
                
                console.log(`✅ Simulação ${app} carregada`);
            }
            
            this.config.simulations = simulations;
        } catch (error) {
            console.error('❌ Erro ao carregar simulações:', error);
            throw new Error('Falha ao carregar configurações das simulações');
        }
    }

    // Aplicar configurações de ambiente
    applyEnvironmentConfig(envConfig) {
        // Definir ambiente atual
        const currentEnv = envConfig.current || 'development';
        this.config.currentEnvironment = currentEnv;
        
        // Aplicar configurações específicas do ambiente
        const envSettings = envConfig[currentEnv];
        if (envSettings) {
            this.config.api = {
                baseUrl: envSettings.base_url,
                endpoint: envSettings.api_endpoint,
                debugMode: envSettings.debug_mode,
                cacheEnabled: envSettings.cache_enabled
            };
        }
        
        // Configurações do sistema
        this.config.system = envConfig.system;
    }

    // Obter configuração específica
    get(path, defaultValue = null) {
        if (!this.loaded) {
            console.warn('Configurações ainda não foram carregadas');
            return defaultValue;
        }
        
        const keys = path.split('.');
        let current = this.config;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        
        return current;
    }

    // Obter configuração de capítulo
    getChapter(chapterId) {
        return this.get(`chapters`, []).find(ch => ch.id === chapterId);
    }

    // Obter configuração de simulação
    getSimulation(appId) {
        return this.get(`simulations.${appId}`);
    }

    // Obter regras de validação
    getValidationRules(appId = null) {
        if (appId) {
            return this.get(`validation.simulations.${appId}`);
        }
        return this.get('validation');
    }

    // Obter configuração de UI
    getUIConfig() {
        return this.get('ui-config');
    }

    // Obter configuração de tema
    getThemeConfig() {
        const uiConfig = this.getUIConfig();
        return uiConfig ? uiConfig.theme : {};
    }

    // Obter configuração do desktop
    getDesktopConfig() {
        const uiConfig = this.getUIConfig();
        return uiConfig ? uiConfig.desktop : {};
    }

    // Verificar se está em modo debug
    isDebugMode() {
        return this.get('api.debugMode', false);
    }

    // Verificar se cache está habilitado
    isCacheEnabled() {
        return this.get('api.cacheEnabled', true);
    }

    // Obter URL base da API
    getApiBaseUrl() {
        return this.get('api.baseUrl', '');
    }

    // Recarregar configurações específicas
    async reloadConfig(configType) {
        try {
            switch (configType) {
                case 'system':
                    await this.loadSystemConfigs();
                    break;
                case 'chapters':
                    await this.loadChaptersContent();
                    break;
                case 'simulations':
                    await this.loadSimulationConfigs();
                    break;
                default:
                    await this.loadAllConfigs();
            }
            
            console.log(`✅ Configurações ${configType} recarregadas`);
        } catch (error) {
            console.error(`❌ Erro ao recarregar ${configType}:`, error);
            throw error;
        }
    }

    // Validar integridade das configurações
    validateConfigs() {
        const errors = [];
        
        // Validar configurações obrigatórias
        const requiredPaths = [
            'validation.progress',
            'ui-config.theme.primary_color',
            'system.name',
            'environment.current'
        ];
        
        for (const path of requiredPaths) {
            if (!this.get(path)) {
                errors.push(`Configuração obrigatória ausente: ${path}`);
            }
        }
        
        // Validar estrutura dos capítulos
        const chapters = this.get('chapters', []);
        if (chapters.length !== 12) {
            errors.push(`Número incorreto de capítulos: ${chapters.length}/12`);
        }
        
        // Validar configurações das simulações
        const simulations = this.get('simulations', {});
        const requiredApps = ['outlook', 'excel', 'word', 'trello', 'erp'];
        for (const app of requiredApps) {
            if (!simulations[app]) {
                errors.push(`Configuração da simulação ${app} ausente`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Exportar configurações atuais
    exportConfigs() {
        return {
            timestamp: new Date().toISOString(),
            version: this.get('system.version', '2.0.0'),
            environment: this.get('currentEnvironment', 'development'),
            configs: this.config
        };
    }

    // Limpar cache
    clearCache() {
        this.cache.clear();
        console.log('Cache de configurações limpo');
    }
}

// Instância global do carregador de configurações
window.configLoader = new ConfigLoader();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigLoader;
}

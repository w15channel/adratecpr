# ADRA-TEC - Sistema Administrativo

## 📋 Visão Geral

Este documento descreve a estrutura administrativa do sistema ADRA-TEC, que permite a separação e gerenciamento de chaves, comandos e variáveis do sistema educacional.

## 🏗️ Estrutura de Diretórios

```
adratecpr/
├── config/                    # Configurações do sistema
│   ├── keys.json             # Chaves de API e autenticação
│   ├── environment.json      # Configurações de ambiente
│   ├── validation.json       # Regras de validação
│   ├── ui-config.json        # Configurações de interface
│   └── config-loader.js      # Carregador de configurações
├── content/                   # Conteúdo educacional
│   ├── chapters/             # 12 capítulos educacionais
│   │   ├── capitulo-01.json
│   │   ├── capitulo-02.json
│   │   └── ...
│   ├── simulations/          # Configurações das simulações
│   │   ├── outlook.json
│   │   ├── excel.json
│   │   ├── word.json
│   │   ├── trello.json
│   │   └── erp.json
│   └── assessments/          # Avaliações (quizzes)
├── commands/                  # Lógica do sistema
│   ├── system.js            # Comandos do sistema operacional
│   ├── validation.js        # Motor de validação
│   ├── progress.js          # Gerenciamento de progresso
│   └── admin.js             # Funções administrativas
└── admin-interface.html     # Painel administrativo web
```

## 🔑 Chaves (Keys)

### keys.json
Contém configurações sensíveis do sistema:
- **api**: Configurações de APIs externas
- **authentication**: Tokens e chaves de autenticação
- **security**: Configurações de segurança e criptografia

## ⚙️ Configurações de Ambiente

### environment.json
Define configurações para diferentes ambientes:
- **development**: Ambiente de desenvolvimento local
- **production**: Ambiente de produção
- **system**: Informações do sistema (nome, versão)

### ui-config.json
Configurações da interface do usuário:
- **theme**: Cores e aparência visual
- **desktop**: Configurações da área de trabalho
- **animations**: Animações e transições
- **notifications**: Configurações de notificações

### validation.json
Regras de validação do sistema:
- **simulations**: Validação para cada aplicação simulada
- **quiz**: Configurações das avaliações
- **progress**: Regras de cálculo de XP

## 📚 Conteúdo Educacional

### Capítulos (content/chapters/)
Cada capítulo contém:
```json
{
  "id": 1,
  "label": "Capítulo 1",
  "icon": "fas fa-globe",
  "title": "Introdução à Administração",
  "order": 1,
  "theory": {
    "content": [...]  // Conteúdo teórico estruturado
  },
  "simulations": [...], // 5 simulações práticas
  "assessment": {
    "quiz": [...] // 5 questões de avaliação
  }
}
```

### Simulações (content/simulations/)
Configurações para cada aplicação simulada:
- **outlook**: Cliente de email corporativo
- **excel**: Planilha eletrônica
- **word**: Processador de texto
- **trello**: Sistema de gestão de tarefas
- **erp**: Sistema empresarial

## ⚡ Comandos do Sistema

### system.js
Comandos essenciais do sistema operacional:
- **bootSystem()**: Inicialização do sistema
- **login()**: Autenticação de usuários
- **logout()**: Encerramento de sessão
- **shutdown()**: Desligamento do sistema

### validation.js
Motor de validação para simulações:
- **validateSimulation()**: Validação principal
- **validateOutlook()**: Validação específica de email
- **validateExcel()**: Validação específica de planilha
- **validateWord()**: Validação específica de documento
- **validateTrello()**: Validação específica de quadro
- **validateERP()**: Validação específica de formulário

### progress.js
Gerenciamento de progresso e XP:
- **calculateTotalXP()**: Cálculo de XP total
- **addXP()**: Adicionar XP ao usuário
- **checkLevelUp()**: Verificação de avanço de nível
- **calculateGlobalProgress()**: Progresso geral
- **isChapterUnlocked()**: Liberação de capítulos

### admin.js
Funções administrativas:
- **authenticateAdmin()**: Autenticação administrativa
- **listChapters()**: Listar capítulos
- **updateChapter()**: Atualizar capítulo
- **listSimulationConfigs()**: Listar configurações
- **getSystemStats()**: Estatísticas do sistema
- **createBackup()**: Criar backup
- **restoreBackup()**: Restaurar backup

## 🖥️ Painel Administrativo

### Acesso
Acesse o painel através do arquivo `admin-interface.html`:
- URL: `http://localhost/adratecpr/admin-interface.html`
- Credenciais padrão: `admin` / `adra123`

### Funcionalidades

#### Dashboard
- Visão geral do sistema
- Estatísticas em tempo real
- Atividade recente

#### Gerenciamento de Capítulos
- Listar todos os 12 capítulos
- Editar conteúdo teórico
- Configurar simulações
- Ajustar avaliações

#### Configurações de Simulações
- Personalizar cada aplicação
- Ajustar regras de validação
- Configurar interface

#### Configurações do Sistema
- Ambiente (dev/prod)
- Interface visual
- Animações e temas

#### Backup e Restauração
- Exportar configurações completas
- Importar backup anterior
- Validação de integridade

## 🔧 Como Usar

### 1. Carregar Configurações
```javascript
// Carregar todas as configurações
await window.configLoader.loadAllConfigs();

// Obter configuração específica
const theme = window.configLoader.get('ui-config.theme');
```

### 2. Validar Simulação
```javascript
// Criar motor de validação
const validator = new ValidationEngine(config);

// Validar entrada do usuário
const result = validator.validateSimulation('outlook', userInput, expectedData);
```

### 3. Gerenciar Progresso
```javascript
// Criar gerenciador de progresso
const progress = new ProgressManager(config);

// Calcular XP total
const totalXP = progress.calculateTotalXP(userData);
```

### 4. Administração
```javascript
// Criar gerenciador administrativo
const admin = new AdminManager(config);

// Listar capítulos
const chapters = await admin.listChapters();
```

## 📝 Exemplos de Uso

### Adicionar Novo Capítulo
1. Acesse o painel administrativo
2. Vá para "Capítulos"
3. Clique em "Novo Capítulo"
4. Preencha o formulário
5. Salve as alterações

### Modificar Validação
1. Vá para "Configurar Simulações"
2. Selecione a aplicação desejada
3. Ajuste as regras de validação
4. Teste as alterações
5. Salve as configurações

### Backup do Sistema
1. Acesse "Backup e Restauração"
2. Clique em "Criar Backup"
3. Faça download do arquivo JSON
4. Armazene em local seguro

## 🚀 Implantação

### Ambiente de Desenvolvimento
```bash
# Servir localmente
python -m http.server 8000
# Acessar: http://localhost:8000/admin-interface.html
```

### Ambiente de Produção
1. Configure `environment.json` para produção
2. Defina chaves de API em `keys.json`
3. Ajuste regras de validação
4. Teste todas as funcionalidades
5. Implante no servidor

## 🔐 Segurança

### Chaves Sensíveis
- Mantenha `keys.json` seguro
- Não exponha no repositório
- Use variáveis de ambiente quando possível

### Autenticação Administrativa
- Altere credenciais padrão
- Implemente autenticação real
- Use HTTPS em produção

### Validação de Dados
- Sanitize todas as entradas
- Valide formatos esperados
- Implemente rate limiting

## 🐛 Troubleshooting

### Configurações Não Carregam
- Verifique estrutura JSON
- Confirme permissões de arquivo
- Verifique console para erros

### Validação Falha
- Revise regras em `validation.json`
- Verifique formato dos dados
- Teste com dados conhecidos

### Painel Não Funciona
- Confirme carregamento do config-loader.js
- Verifique console para erros JavaScript
- Teste autenticação administrativa

## 📈 Melhorias Futuras

- [ ] API REST para administração
- [ ] Sistema de usuários completo
- [ ] Analytics detalhados
- [ ] Cache inteligente
- [ ] Internacionalização
- [ ] Testes automatizados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este documento
2. Consulte o console do navegador
3. Revise os logs do sistema
4. Entre em contato com o suporte técnico

---

**ADRA-TEC v2.0** - Sistema Administrativo Completo

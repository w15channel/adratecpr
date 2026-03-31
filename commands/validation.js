// SISTEMA DE VALIDAÇÃO ADRA-TEC
// Lógica de validação para todas as simulações

class ValidationEngine {
    constructor(config) {
        this.config = config;
        this.validationRules = config.validation;
    }

    // Validação principal para qualquer aplicação
    validateSimulation(appId, userInput, expectedData) {
        const appRules = this.validationRules.simulations[appId];
        if (!appRules) {
            return { success: false, error: "Aplicação não configurada para validação" };
        }

        switch (appId) {
            case 'outlook':
                return this.validateOutlook(userInput, expectedData, appRules);
            case 'excel':
                return this.validateExcel(userInput, expectedData, appRules);
            case 'word':
                return this.validateWord(userInput, expectedData, appRules);
            case 'trello':
                return this.validateTrello(userInput, expectedData, appRules);
            case 'erp':
                return this.validateERP(userInput, expectedData, appRules);
            default:
                return { success: false, error: "Aplicação desconhecida" };
        }
    }

    // Validação Outlook
    validateOutlook(input, expected, rules) {
        const errors = [];
        const normalizedInput = this.normalizeText(input.body);

        // Validar campos obrigatórios
        rules.required_fields.forEach(field => {
            if (!input[field] || input[field].trim() === '') {
                errors.push(`Campo ${field} é obrigatório`);
            }
        });

        // Validar formato do email
        if (input.to && !new RegExp(rules.validation_rules.email_format).test(input.to)) {
            errors.push("Formato de email inválido");
        }

        // Validar assunto
        if (input.subject && expected.subject) {
            const normalizedSubject = this.normalizeText(input.subject);
            if (!normalizedSubject.includes(this.normalizeText(expected.subject))) {
                errors.push("Assunto não corresponde ao esperado");
            }
        }

        // Validar palavras-chave no corpo
        if (expected.body_keywords && rules.validation_rules.required_keywords) {
            expected.body_keywords.forEach(keyword => {
                if (!normalizedInput.includes(this.normalizeText(keyword))) {
                    errors.push(`Palavra-chave "${keyword}" não encontrada no corpo`);
                }
            });
        }

        // Validar comprimento mínimo
        if (input.body && input.body.length < rules.validation_rules.min_body_length) {
            errors.push(`Corpo deve ter pelo menos ${rules.validation_rules.min_body_length} caracteres`);
        }

        return {
            success: errors.length === 0,
            errors: errors,
            score: Math.max(0, 100 - (errors.length * 20))
        };
    }

    // Validação Excel
    validateExcel(input, expected, rules) {
        const errors = [];

        Object.entries(expected).forEach(([cellId, expectedValue]) => {
            const inputValue = input[cellId];
            
            if (!inputValue || inputValue.trim() === '') {
                errors.push(`Célula ${cellId} está vazia`);
                return;
            }

            const normalizedInput = this.normalizeText(inputValue);
            const normalizedExpected = this.normalizeText(expectedValue);

            if (rules.validation_rules.case_sensitive) {
                if (inputValue !== expectedValue) {
                    errors.push(`Célula ${cellId}: valor incorreto`);
                }
            } else {
                if (rules.validation_rules.allow_partial_match) {
                    if (!normalizedInput.includes(normalizedExpected)) {
                        errors.push(`Célula ${cellId}: valor não contém "${expectedValue}"`);
                    }
                } else {
                    if (normalizedInput !== normalizedExpected) {
                        errors.push(`Célula ${cellId}: valor incorreto`);
                    }
                }
            }

            // Validar valores numéricos
            if (rules.validation_rules.numeric_values && !isNaN(expectedValue)) {
                if (isNaN(inputValue)) {
                    errors.push(`Célula ${cellId}: valor numérico esperado`);
                }
            }
        });

        return {
            success: errors.length === 0,
            errors: errors,
            score: Math.max(0, 100 - (errors.length * 25))
        };
    }

    // Validação Word
    validateWord(input, expected, rules) {
        const errors = [];
        const normalizedContent = this.normalizeText(input.content);

        // Validar comprimento mínimo
        if (input.content.length < rules.validation_rules.min_content_length) {
            errors.push(`Conteúdo deve ter pelo menos ${rules.validation_rules.min_content_length} caracteres`);
        }

        // Validar palavras-chave
        if (expected.body_keywords && rules.validation_rules.required_keywords) {
            expected.body_keywords.forEach(keyword => {
                if (!normalizedContent.includes(this.normalizeText(keyword))) {
                    errors.push(`Conceito chave não encontrado: "${keyword}"`);
                }
            });
        }

        return {
            success: errors.length === 0,
            errors: errors,
            score: Math.max(0, 100 - (errors.length * 20))
        };
    }

    // Validação Trello
    validateTrello(input, expected, rules) {
        const errors = [];

        Object.entries(expected).forEach(([cardId, expectedColumn]) => {
            const actualColumn = input[cardId];
            
            if (actualColumn === undefined) {
                errors.push(`Cartão ${cardId} não encontrado`);
                return;
            }

            if (rules.validation_rules.exact_column_match) {
                if (actualColumn !== expectedColumn) {
                    errors.push(`Cartão ${cardId}: coluna incorreta`);
                }
            }
        });

        return {
            success: errors.length === 0,
            errors: errors,
            score: Math.max(0, 100 - (errors.length * 30))
        };
    }

    // Validação ERP
    validateERP(input, expected, rules) {
        const errors = [];

        Object.entries(expected).forEach(([fieldId, expectedValue]) => {
            const inputValue = input[fieldId];
            
            if (!inputValue || inputValue.trim() === '') {
                errors.push(`Campo ${fieldId} é obrigatório`);
                return;
            }

            // Validar campos select
            if (rules.validation_rules.select_required) {
                const normalizedInput = this.normalizeText(inputValue);
                const normalizedExpected = this.normalizeText(expectedValue);
                
                if (normalizedInput !== normalizedExpected) {
                    errors.push(`Campo ${fieldId}: valor incorreto`);
                }
            }

            // Validar campos texto
            if (rules.validation_rules.text_validation === 'alphanumeric') {
                if (!/^[a-zA-Z0-9\s]*$/.test(inputValue)) {
                    errors.push(`Campo ${fieldId}: apenas caracteres alfanuméricos permitidos`);
                }
            }
        });

        return {
            success: errors.length === 0,
            errors: errors,
            score: Math.max(0, 100 - (errors.length * 25))
        };
    }

    // Normalização de texto para comparação
    normalizeText(text) {
        if (!text) return '';
        return text.toLowerCase()
                   .normalize("NFD")
                   .replace(/[\u0300-\u036f]/g, "")
                   .trim();
    }

    // Validação de quiz
    validateQuiz(questionIndex, selectedAnswer, correctAnswer) {
        const isCorrect = selectedAnswer === correctAnswer;
        const score = isCorrect ? 100 : 0;

        return {
            success: isCorrect,
            score: score,
            feedback: isCorrect ? "Resposta correta!" : "Resposta incorreta. Estude novamente o material."
        };
    }
}

// Exportar para uso no sistema principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValidationEngine;
}

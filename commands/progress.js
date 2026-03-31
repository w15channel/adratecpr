// SISTEMA DE PROGRESSO ADRA-TEC
// Cálculo e gerenciamento de XP e progresso do usuário

class ProgressManager {
    constructor(config) {
        this.config = config;
        this.xpConfig = config.validation.progress;
    }

    // Calcular XP total do usuário
    calculateTotalXP(progressData) {
        let totalXP = 0;

        // XP por teoria lida
        if (progressData.read && progressData.read.length > 0) {
            totalXP += progressData.read.length * this.xpConfig.xp_per_theory;
        }

        // XP por simulações completas
        if (progressData.sims) {
            Object.values(progressData.sims).forEach(chapterSims => {
                // Remove o app 'tasks' da contagem (apenas os 5 apps reais)
                const realSims = chapterSims.filter(app => app !== 'tasks');
                totalXP += realSims.length * this.xpConfig.xp_per_task;
            });
        }

        // XP por quizzes completos
        if (progressData.quizzes) {
            Object.values(progressData.quizzes).forEach(chapterQuiz => {
                totalXP += Object.keys(chapterQuiz).length * this.xpConfig.xp_per_quiz;
            });
        }

        return totalXP;
    }

    // Adicionar XP ao usuário
    addXP(currentXP, xpAmount, reason) {
        const newXP = currentXP + xpAmount;
        
        return {
            previousXP: currentXP,
            newXP: newXP,
            added: xpAmount,
            reason: reason,
            levelUp: this.checkLevelUp(currentXP, newXP)
        };
    }

    // Verificar se usuário subiu de nível
    checkLevelUp(previousXP, newXP) {
        const previousLevel = this.calculateLevel(previousXP);
        const newLevel = this.calculateLevel(newXP);
        
        return {
            leveledUp: newLevel > previousLevel,
            previousLevel: previousLevel,
            newLevel: newLevel,
            rank: this.getRank(newLevel)
        };
    }

    // Calcular nível do usuário
    calculateLevel(xp) {
        // Cada 330 XP = 1 nível (12 capítulos * 27.5 XP médio por capítulo)
        return Math.floor(xp / 330) + 1;
    }

    // Obter rank/baseado no XP
    getRank(xp) {
        if (xp > 3100) return { name: "👑 Diretor Executivo", color: "#FFD700" };
        if (xp > 2500) return { name: "🥇 Coordenador Geral", color: "#C0C0C0" };
        if (xp > 1500) return { name: "🥈 Analista Pleno", color: "#CD7F32" };
        if (xp > 500) return { name: "🥉 Auxiliar Administrativo", color: "#8B4513" };
        return { name: "🌱 Aprendiz", color: "#228B22" };
    }

    // Calcular progresso global
    calculateGlobalProgress(progressData) {
        const totalChapters = 12;
        let completedChapters = 0;

        // Verificar capítulos completamente finalizados
        for (let i = 1; i <= totalChapters; i++) {
            const isRead = progressData.read && progressData.read.includes(i);
            const realSimsDone = progressData.sims && progressData.sims[i] 
                ? progressData.sims[i].filter(app => app !== 'tasks').length 
                : 0;
            const quizDone = progressData.quizzes && progressData.quizzes[i] 
                ? Object.keys(progressData.quizzes[i]).length 
                : 0;

            if (isRead && realSimsDone === 5 && quizDone === 5) {
                completedChapters++;
            }
        }

        return {
            completed: completedChapters,
            total: totalChapters,
            percentage: Math.round((completedChapters / totalChapters) * 100)
        };
    }

    // Verificar se capítulo está liberado
    isChapterUnlocked(chapterId, progressData) {
        // Capítulo 1 sempre liberado
        if (chapterId === 1) return true;

        // Verificar se capítulo anterior foi completado
        const previousChapter = chapterId - 1;
        const isPreviousRead = progressData.read && progressData.read.includes(previousChapter);
        const previousSimsDone = progressData.sims && progressData.sims[previousChapter] 
            ? progressData.sims[previousChapter].filter(app => app !== 'tasks').length 
            : 0;
        const previousQuizDone = progressData.quizzes && progressData.quizzes[previousChapter] 
            ? Object.keys(progressData.quizzes[previousChapter]).length 
            : 0;

        return isPreviousRead && previousSimsDone === 5 && previousQuizDone === 5;
    }

    // Verificar se avaliação está liberada
    isAssessmentUnlocked(chapterId, progressData) {
        const isRead = progressData.read && progressData.read.includes(chapterId);
        const simsDone = progressData.sims && progressData.sims[chapterId] 
            ? progressData.sims[chapterId].filter(app => app !== 'tasks').length 
            : 0;

        return isRead && simsDone === 5;
    }

    // Calcular XP necessário para próximo nível
    getXPToNextLevel(currentXP) {
        const currentLevel = this.calculateLevel(currentXP);
        const nextLevelXP = currentLevel * 330;
        return Math.max(0, nextLevelXP - currentXP);
    }

    // Gerar relatório de progresso detalhado
    generateProgressReport(progressData) {
        const totalXP = this.calculateTotalXP(progressData);
        const level = this.calculateLevel(totalXP);
        const rank = this.getRank(totalXP);
        const globalProgress = this.calculateGlobalProgress(progressData);
        const xpToNext = this.getXPToNextLevel(totalXP);

        return {
            summary: {
                totalXP: totalXP,
                level: level,
                rank: rank,
                globalProgress: globalProgress,
                xpToNextLevel: xpToNext,
                completionPercentage: (totalXP / this.xpConfig.total_required_xp) * 100
            },
            chapters: this.generateChapterReport(progressData),
            achievements: this.calculateAchievements(progressData),
            recommendations: this.generateRecommendations(progressData)
        };
    }

    // Gerar relatório por capítulo
    generateChapterReport(progressData) {
        const report = {};
        
        for (let i = 1; i <= 12; i++) {
            const isRead = progressData.read && progressData.read.includes(i);
            const simsDone = progressData.sims && progressData.sims[i] 
                ? progressData.sims[i].filter(app => app !== 'tasks').length 
                : 0;
            const quizDone = progressData.quizzes && progressData.quizzes[i] 
                ? Object.keys(progressData.quizzes[i]).length 
                : 0;

            report[i] = {
                theory: isRead,
                simulations: simsDone,
                quiz: quizDone,
                completed: isRead && simsDone === 5 && quizDone === 5,
                xp: (isRead ? this.xpConfig.xp_per_theory : 0) + 
                     (simsDone * this.xpConfig.xp_per_task) + 
                     (quizDone * this.xpConfig.xp_per_quiz)
            };
        }

        return report;
    }

    // Calcular conquistas
    calculateAchievements(progressData) {
        const achievements = [];
        const totalXP = this.calculateTotalXP(progressData);
        const globalProgress = this.calculateGlobalProgress(progressData);

        // Conquista por XP
        if (totalXP >= 500) achievements.push({ id: 'first_xp', name: 'Primeiros Passos', description: 'Alcançou 500 XP' });
        if (totalXP >= 1500) achievements.push({ id: 'intermediate', name: 'Intermediário', description: 'Alcançou 1500 XP' });
        if (totalXP >= 2500) achievements.push({ id: 'advanced', name: 'Avançado', description: 'Alcançou 2500 XP' });

        // Conquista por capítulos
        if (globalProgress.completed >= 3) achievements.push({ id: 'triple', name: 'Trinca', description: 'Completou 3 capítulos' });
        if (globalProgress.completed >= 6) achievements.push({ id: 'halfway', name: 'Metade', description: 'Completou 6 capítulos' });
        if (globalProgress.completed >= 12) achievements.push({ id: 'master', name: 'Mestre', description: 'Completou todos os capítulos' });

        return achievements;
    }

    // Gerar recomendações
    generateRecommendations(progressData) {
        const recommendations = [];
        const globalProgress = this.calculateGlobalProgress(progressData);

        if (globalProgress.completed === 0) {
            recommendations.push({ type: 'start', message: 'Comece pelo Capítulo 1 - Introdução à Administração' });
        }

        // Verificar capítulos com teoria lida mas simulações incompletas
        for (let i = 1; i <= 12; i++) {
            const isRead = progressData.read && progressData.read.includes(i);
            const simsDone = progressData.sims && progressData.sims[i] 
                ? progressData.sims[i].filter(app => app !== 'tasks').length 
                : 0;

            if (isRead && simsDone < 5) {
                recommendations.push({ 
                    type: 'practice', 
                    message: `Complete as simulações do Capítulo ${i} - faltam ${5 - simsDone} atividades` 
                });
            }
        }

        return recommendations;
    }
}

// Exportar para uso no sistema principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressManager;
}

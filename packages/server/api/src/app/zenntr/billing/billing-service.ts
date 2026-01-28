import { FastifyInstance } from 'fastify'
import { ProjectId } from '@activepieces/shared'

// Serviço responsável pelo faturamento e gerenciamento de cotas do Zenntr
export const zenntrBillingService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de Faturamento Zenntr Inicializado')
    },

    /**
     * Registra o uso de um recurso (ex: execução de fluxo).
     * @param projectId ID do projeto
     * @param metric Métrica a ser incrementada (ex: 'flowRuns')
     * @param amount Quantidade a incrementar
     */
    async trackUsage(projectId: ProjectId, metric: string, amount: number = 1): Promise<void> {
        // TODO: Incrementar o contador no banco de dados (ex: Redis ou Postgres)
        // await usageRepo.increment({ projectId }, metric, amount)
    },

    /**
     * Verifica se o projeto tem cota disponível para uma operação.
     * @param projectId ID do projeto
     * @param metric Métrica a verificar
     */
    async hasQuota(projectId: ProjectId, metric: string): Promise<boolean> {
        // TODO: Comparar uso atual com limites do plano
        return true
    },

    /**
     * Reseta as cotas de uso para projetos cujo ciclo de faturamento virou.
     */
    async resetQuotas(): Promise<void> {
        // TODO: Implementar cron job para resetar cotas mensais
    }
}

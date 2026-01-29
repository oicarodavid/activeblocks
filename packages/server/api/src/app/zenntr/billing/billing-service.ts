import { ProjectId } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'

// Serviço responsável pelo faturamento e gerenciamento de cotas do Zenntr
export const zenntrBillingService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Faturamento Zenntr Inicializado')
    },

    /**
     * Registra o uso de um recurso (ex: execução de fluxo).
     * @param projectId ID do projeto
     * @param metric Métrica a ser incrementada (ex: 'flowRuns')
     * @param amount Quantidade a incrementar
     */
    async trackUsage(_projectId: ProjectId, _metric: string, _amount = 1): Promise<void> {
        // TODO: Incrementar o contador no banco de dados (ex: Redis ou Postgres)
        // await usageRepo.increment({ projectId }, metric, amount)
    },

    /**
     * Verifica se o projeto tem cota disponível para uma operação.
     * @param projectId ID do projeto
     * @param metric Métrica a verificar
     */
    async hasQuota(_projectId: ProjectId, _metric: string): Promise<boolean> {
        // TODO: Comparar uso atual com limites do plano
        return true
    },

    /**
     * Reseta as cotas de uso para projetos cujo ciclo de faturamento virou.
     */
    async resetQuotas(): Promise<void> {
        // TODO: Implementar cron job para resetar cotas mensais
    },
}

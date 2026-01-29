import { apId } from '@activepieces/shared'
import { AlertSeverity } from '@zenntr/shared'
import { FastifyInstance } from 'fastify'
import { In } from 'typeorm'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrAlertEntity } from './alert.entity'

const repo = databaseConnection().getRepository(ZenntrAlertEntity)

// Serviço de Alertas do Sistema
export const zenntrAlertsService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Alertas Zenntr Inicializado')
    },

    /**
     * Cria um novo alerta para um projeto.
     * @param projectId ID do projeto
     * @param alert Dados do alerta (severidade, mensagem)
     */
    async create(projectId: string, alert: { severity: string, message: string }): Promise<void> {
        await repo.save({
            id: apId(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            projectId,
            severity: alert.severity as AlertSeverity,
            message: alert.message,
            readAt: undefined, 
            data: {},
        })
    },

    /**
     * Marca alertas como lidos.
     * @param alertIds IDs dos alertas
     */
    async markAsRead(alertIds: string[]): Promise<void> {
        if (alertIds.length === 0) return
        
        await repo.update(
            { id: In(alertIds) },
            { 
                readAt: new Date().toISOString(),
                updated: new Date().toISOString(),
            },
        )
    },
}

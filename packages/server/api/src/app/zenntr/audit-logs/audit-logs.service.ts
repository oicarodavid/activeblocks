import { apId } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrAuditEvent, ZenntrAuditEventEntity } from './audit-event.entity'

const repo = databaseConnection().getRepository(ZenntrAuditEventEntity)

export const zenntrAuditLogService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Zenntr Audit Logs Service Initialized')
    },

    async log(event: {
        action: string
        projectId: string
        userId: string
        ipAddress: string
        userAgent: string
        details: Record<string, unknown>
    }): Promise<void> {
        const auditEvent = {
            id: apId(),
            ...event,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
        } as unknown as ZenntrAuditEvent
        
        await repo.save(auditEvent)
    },

    async list(projectId: string, limit = 10): Promise<ZenntrAuditEvent[]> {
        return repo.find({
            where: { projectId },
            take: limit,
            order: { created: 'DESC' },
        })
    },
}

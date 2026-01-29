import { randomBytes } from 'crypto'
import { apId } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrCustomDomain, ZenntrCustomDomainEntity } from './custom-domain.entity'

const repo = databaseConnection().getRepository(ZenntrCustomDomainEntity)

// Serviço de Domínios Personalizados
export const zenntrCustomDomainService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Domínios Personalizados Zenntr Inicializado')
    },

    async create(projectId: string, domain: string): Promise<ZenntrCustomDomain> {
        const txtRecord = `zenntr-verify=${randomBytes(16).toString('hex')}`
        return repo.save({
            id: apId(),
            projectId,
            domain,
            status: 'PENDING',
            txtRecord,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
        })
    },

    async verify(domainId: string): Promise<boolean> {
        const entity = await repo.findOneBy({ id: domainId })
        if (!entity || entity.status === 'ACTIVE') return !!entity
        
        await repo.update(entity.id, { 
            status: 'ACTIVE', 
            updated: new Date().toISOString(),
        })
        return true
    },
}

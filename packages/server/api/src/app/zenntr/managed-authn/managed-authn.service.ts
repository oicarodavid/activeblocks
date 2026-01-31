import { ManagedAuthnConfig } from '@zenntr/shared'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { zenntrManagedAuthnController } from './managed-authn-controller'
import { ZenntrManagedAuthn, ZenntrManagedAuthnEntity } from './managed-authn.entity'

const repo = databaseConnection().getRepository(ZenntrManagedAuthnEntity)

export const zenntrManagedAuthnService = {
    async setup(app: FastifyInstance): Promise<void> {
        await app.register(zenntrManagedAuthnController, { prefix: '/v1/managed-authn' })
        app.log.info('Zenntr Managed Authn Service Initialized')
    },

    async getByDomain(domain: string): Promise<ZenntrManagedAuthn | null> {
        return repo.findOneBy({ domain })
    },

    async createOrUpdate(config: Omit<ManagedAuthnConfig, 'id'>): Promise<ZenntrManagedAuthn> {
        const existing = await repo.findOneBy({ domain: config.domain })
        if (existing) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await repo.update(existing.id, { ...config, updated: new Date().toISOString() } as any)
            return repo.findOneByOrFail({ id: existing.id })
        }
        return repo.save({ ...config, created: new Date().toISOString(), updated: new Date().toISOString() })
    },
}

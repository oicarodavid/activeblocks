import { apId } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrPlatformConfigEntity } from './platform-config.entity'

const repo = databaseConnection().getRepository(ZenntrPlatformConfigEntity)

export const zenntrPlatformService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Zenntr Platform Service Initialized')
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateConfig(key: string, value: any): Promise<void> {
        const existing = await repo.findOneBy({ key })
        if (existing) {
            await repo.update(existing.id, { value, updated: new Date().toISOString() })
        }
        else {
            await repo.save({
                id: apId(),
                key,
                value,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            })
        }
    },

    async getConfig(key: string): Promise<unknown> {
        const config = await repo.findOneBy({ key })
        return config ? config.value : null
    },

    async getPublicConfig(): Promise<unknown> {
        const publicSettings = await this.getConfig('public_settings')
        return {
            name: 'Zenntr Platform',
            version: '1.0.0',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(publicSettings as any),
        }
    },
}

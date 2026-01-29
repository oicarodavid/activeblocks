import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrAppCredential, ZenntrAppCredentialEntity } from './app-credentials.entity'

const repo = databaseConnection().getRepository(ZenntrAppCredentialEntity)

export const zenntrAppCredentialService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Zenntr App Credential Service Initialized')
    },

    async getForApp(appName: string): Promise<ZenntrAppCredential | null> {
        return repo.findOneBy({ appName })
    },
}

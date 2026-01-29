import { AppConnectionScope } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'
import { AppConnectionEntity, AppConnectionSchema } from '../../app-connection/app-connection.entity'
import { databaseConnection } from '../../database/database-connection'

const repo = databaseConnection().getRepository(AppConnectionEntity)

export const zenntrGlobalConnectionService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Zenntr Global Connection Service Initialized')
    },

    async listGlobal(): Promise<AppConnectionSchema[]> {
        return repo.find({ where: { scope: AppConnectionScope.PLATFORM } })
    },
}

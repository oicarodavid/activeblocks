import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrProjectMemberEntity } from '../project-members/project-member.entity'

export const zenntrUserService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Zenntr User Service Initialized')
    },

    async getUserProjectRole(userId: string, projectId: string): Promise<string | null> {
        const memberRepo = databaseConnection().getRepository(ZenntrProjectMemberEntity)
        const member = await memberRepo.findOne({
            where: {
                userId,
                projectId,
            },
        })
        return member ? member.role : null
    },
}

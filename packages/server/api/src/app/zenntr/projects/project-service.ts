import { apId, ProjectId } from '@activepieces/shared'
import { ProjectUsage } from '@zenntr/shared'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ProjectEntity } from '../../project/project-entity'
import { ZenntrProjectPlan, ZenntrProjectPlanEntity } from './project-plan.entity'

const projectRepo = databaseConnection().getRepository(ProjectEntity)
const planRepo = databaseConnection().getRepository(ZenntrProjectPlanEntity)

// Serviço responsável pela lógica de negócios estendida de Projetos no Zenntr
export const zenntrProjectService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Projetos Zenntr Inicializado')
    },

    async checkLimits(projectId: ProjectId, _resource: 'flows' | 'connections' | 'members'): Promise<void> {
        const _plan = await planRepo.findOneBy({ projectId })
        
        // Se não houver plano definido, assume padrão (Free)
        if (!_plan) {
            // Implementar lógica de limites padrão Free Tier aqui
            // Ex: 5 flows, 3 conexões
            return 
        }

        // TODO: Consultar uso real usando os serviços de cada recurso
        // Por enquanto, verificamos apenas se o plano permite
        // if (resource === 'flows' && currentFlows >= plan.activeFlows) { ... }
    },

    /**
     * Cria ou atualiza o plano de um projeto.
     */
    async setPlan(projectId: ProjectId, planDetails: Partial<ZenntrProjectPlan>): Promise<void> {
        const existing = await planRepo.findOneBy({ projectId })
        if (existing) {
            await planRepo.update(existing.id, { ...planDetails, updated: new Date().toISOString() })
        }
        else {
            await planRepo.save({
                id: apId(),
                projectId,
                name: 'FREE',
                flowRuns: 1000,
                activeFlows: 5,
                connections: 5,
                teamMembers: 1,
                ...planDetails,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            })
        }
    },

    async getUsage(projectId: ProjectId): Promise<ProjectUsage | null> {
        const project = await projectRepo.findOne({
            where: { id: projectId },
            relations: {
                flows: true,
                owner: true,
            },
        })
        
        if (!project) return null

        const _plan = await planRepo.findOneBy({ projectId })

        return {
            projectId,
            id: 'usage_' + projectId,
            flowRuns: 0, 
            activeFlows: project.flows.filter(f => f.status === 'ENABLED').length, 
            teamMembers: 1, 
            connections: 0,
            nextResetAt: new Date().toISOString(),
            created: project.created,
            updated: project.updated,
            // Adicionar info do plano
            // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        } as unknown as ProjectUsage
    },
}

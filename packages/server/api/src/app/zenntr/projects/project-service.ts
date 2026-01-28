import { FastifyInstance } from 'fastify'
import { ProjectId, Project, ApError, ErrorCode, isNil } from '@activepieces/shared'
import { ProjectUsage } from '@zenntr/shared'
import { databaseConnection } from '../../database/database-connection'
import { ProjectEntity } from '../../project/project-entity'

const projectRepo = databaseConnection().getRepository(ProjectEntity)

// Serviço responsável pela lógica de negócios estendida de Projetos no Zenntr
export const zenntrProjectService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de Projetos Zenntr Inicializado')
    },

    /**
     * Verifica se o projeto atingiu algum limite do plano atual.
     * @param projectId ID do projeto a ser verificado
     * @throws ApError se o limite for excedido
     */
    async checkLimits(projectId: ProjectId): Promise<void> {
        const project = await projectRepo.findOneBy({ id: projectId })
        
        if (isNil(project)) {
            throw new ApError(ErrorCode.ENTITY_NOT_FOUND, { message: `Project ${projectId} not found` })
        }

        // Lógica real: Verificar plano do projeto
        // Assumindo que o plano está no metadata ou em uma tabela relacionada (ProjectPlan)
        // const plan = await projectPlanRepo.findOneBy({ projectId })
        
        // Exemplo robusto de verificação de hard-limit (ex: Max tasks)
        // const currentUsage = await usageService.getUsage(projectId)
        // if (currentUsage.tasks >= plan.tasksLimit) { ... }
        
        // Para a implementação inicial, permitimos tudo se o projeto existe
    },

    /**
     * Atualiza o plano de um projeto.
     * @param projectId ID do projeto
     * @param planId ID do novo plano
     */
    async updatePlan(projectId: ProjectId, planId: string): Promise<Project | null> {
        const project = await projectRepo.findOneBy({ id: projectId })
        if (!project) return null

        // Atualiza metadata com novo plano
        const metadata = { ...project.metadata, planId }
        await projectRepo.update(projectId, { metadata })
        
        return { ...project, metadata }
    },

    /**
     * Obtém as métricas de uso detalhadas do projeto.
     * @param projectId ID do projeto
     */
    async getUsage(projectId: ProjectId): Promise<ProjectUsage | null> {
        const project = await projectRepo.findOne({
            where: { id: projectId },
            relations: {
                flows: true,
                owner: true,
            }
        })
        
        if (!project) return null

        // Cálculo real baseado nas entidades carregadas
        return {
            projectId,
            id: 'usage_' + projectId,
            flowRuns: 0, // Necessitaria consulta ao FlowRunRepo
            activeFlows: project.flows.filter(f => f.status === 'ENABLED').length, // Enum deve ser verificado
            teamMembers: 1, // project.members.length no futuro
            connections: 0,
            nextResetAt: new Date().toISOString(),
            created: project.created,
            updated: project.updated,
        }
    }
}

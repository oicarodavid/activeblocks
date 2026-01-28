import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrTemplateEntity } from './template.entity'
import { apId, TemplateType } from '@activepieces/shared'

const repo = databaseConnection().getRepository(ZenntrTemplateEntity)

// Serviço de Templates
export const zenntrTemplateService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de Templates Zenntr Inicializado')
    },

    /**
     * Cria um novo template a partir de um fluxo existente.
     * @param flowId ID do fluxo base
     * @param name Nome do template
     */
    async createFromFlow(flowId: string, name: string): Promise<any> {
        // TODO: Ler fluxo real do FlowRepo (não injetado aqui para manter isolamento neste exato momento)
        const mockFlowData = { nodes: [], edges: [] } 
        
        const template = await repo.save({
            id: apId(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            name,
            type: 'PROJECT' as TemplateType,
            flow: mockFlowData,
            tags: [],
            projectId: null, // Ajustar conforme contexto
            platformId: null
        })
        
        return template
    },

    /**
     * Lista templates disponíveis para o usuário.
     * @param projectId ID do projeto (opcional)
     */
    async list(projectId?: string): Promise<any[]> {
        const query = repo.createQueryBuilder('template')
        
        // Retorna templates de PLATAFORMA (públicos) OU do PROJETO específico
        query.where('template.type = :platformType', { platformType: 'PLATFORM' })
        
        if (projectId) {
            query.orWhere('(template.type = :projectType AND template.projectId = :projectId)', { 
                projectType: 'PROJECT', 
                projectId 
            })
        }
        
        return await query.getMany()
    }
}

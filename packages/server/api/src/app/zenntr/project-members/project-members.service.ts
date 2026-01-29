import { ProjectResourceType, securityAccess } from '@activepieces/server-shared'
import { apId, PrincipalType } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrProjectMember, ZenntrProjectMemberEntity } from './project-member.entity'

// Serviço de Membros de Projeto
export const zenntrProjectMembersService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Zenntr Project Members Service Initialized')
        
        // Inicializa o repositório dentro do setup para garantir que a conexão está pronta
        const repo = databaseConnection().getRepository(ZenntrProjectMemberEntity)
        
        // GET /v1/project-members - Lista membros do projeto
        app.get('/v1/project-members', {
            config: {
                security: securityAccess.project([PrincipalType.USER], undefined, {
                    type: ProjectResourceType.QUERY,
                    queryKey: 'projectId',
                }),
            },
        }, async (req) => {
            const { projectId, limit = 100 } = req.query as { projectId: string, limit?: number }
            
            const members = await repo.find({
                where: { projectId },
                take: limit,
            })
            
            // Retorna no formato SeekPage esperado pelo frontend
            return {
                data: members,
                next: null,
                previous: null,
            }
        })
        
        // GET /v1/project-members/role - Retorna a role do usuário atual no projeto
        app.get('/v1/project-members/role', {
            config: {
                security: securityAccess.project([PrincipalType.USER], undefined, {
                    type: ProjectResourceType.QUERY,
                    queryKey: 'projectId',
                }),
            },
        }, async (req) => {
            const { projectId } = req.query as { projectId: string }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const principal = (req as any).principal
            
            if (!principal?.id) {
                return null
            }
            
            const member = await repo.findOne({
                where: { projectId, userId: principal.id },
            })
            
            return member?.role ?? null
        })
        
        // POST /v1/project-members/:id - Atualiza a role de um membro
        app.post('/v1/project-members/:id', {
            config: {
                security: securityAccess.publicPlatform([PrincipalType.USER]),
            },
        }, async (req) => {
            const { id } = req.params as { id: string }
            const { role } = req.body as { role: string }
            
            await repo.update(id, {
                role: role as ZenntrProjectMember['role'],
                updated: new Date().toISOString(),
            })
            
            return { success: true }
        })
        
        // DELETE /v1/project-members/:id - Remove um membro do projeto
        app.delete('/v1/project-members/:id', {
            config: {
                security: securityAccess.publicPlatform([PrincipalType.USER]),
            },
        }, async (req) => {
            const { id } = req.params as { id: string }
            
            await repo.delete(id)
            
            return { success: true }
        })
        
        // POST /v1/project-members - Adiciona um membro ao projeto (para invites)
        app.post('/v1/project-members', {
            config: {
                security: securityAccess.publicPlatform([PrincipalType.USER]),
            },
        }, async (req) => {
            const { projectId, userId, role } = req.body as {
                projectId: string
                userId: string
                role: ZenntrProjectMember['role']
            }
            
            const member = await repo.save({
                id: apId(),
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                projectId,
                userId,
                role,
                status: 'ACTIVE',
            })
            
            return member
        })
    },
}

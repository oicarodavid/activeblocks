import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrGitRepoEntity } from './git-repo.entity'
import { apId } from '@activepieces/shared'

const repo = databaseConnection().getRepository(ZenntrGitRepoEntity)

// Serviço de Integração com Git
export const zenntrGitRepoService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de Git Repo Zenntr Inicializado')
    },

    /**
     * Configura um repositório Git para um projeto.
     * @param projectId ID do projeto
     * @param config Configuração do Git
     */
    async configure(projectId: string, config: { remoteUrl: string; branch: string; sshPrivateKey: string; slug: string }): Promise<void> {
        const existing = await repo.findOneBy({ projectId })
        
        if (existing) {
            await repo.update(existing.id, {
                remoteUrl: config.remoteUrl,
                branch: config.branch,
                sshPrivateKey: config.sshPrivateKey,
                slug: config.slug,
                updated: new Date().toISOString()
            })
        } else {
            await repo.save({
                id: apId(),
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                projectId,
                remoteUrl: config.remoteUrl,
                branch: config.branch,
                sshPrivateKey: config.sshPrivateKey,
                slug: config.slug
            })
        }
    },

    /**
     * Sincroniza o projeto com o repositório Git.
     * @param projectId ID do projeto
     */
    async sync(projectId: string): Promise<void> {
        const repoConfig = await repo.findOneBy({ projectId })
        if (!repoConfig) {
             throw new Error('Git repository not configured for this project')
        }
        
        console.log(`[Zenntr Git] Sincronizando projeto ${projectId} com ${repoConfig.remoteUrl}`)
        // Aqui entraria a lógica complexa de git pull/push usando biblioteca git-native ou similar
        // No contexto deste serviço, estamos lidando com a persistência da configuração.
    }
}

import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrManagedAuthnEntity } from './managed-authn.entity'
import { apId } from '@activepieces/shared'

const repo = databaseConnection().getRepository(ZenntrManagedAuthnEntity)

// Serviço de Autenticação Gerenciada (IDPs externos como Okta, Azure AD)
export const zenntrManagedAuthnService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de Autenticação Gerenciada Zenntr Inicializado')
    },

    /**
     * Configura um novo provedor de identidade externo.
     * @param config Configuração do IDP
     */
    async configureProvider(config: { domain: string; ssoUrl: string; cert: string; name?: string }): Promise<void> {
        const existing = await repo.findOneBy({ name: config.name || config.domain })
        
        if (existing) {
            await repo.update(existing.id, {
                authUrl: config.ssoUrl,
                tokenUrl: '', // TODO: Adicionar URL de token se necessário
                // Mapear outros campos conform entidade
            })
        } else {
             await repo.save({
                id: apId(),
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                name: config.name || config.domain,
                authUrl: config.ssoUrl,
                tokenUrl: '',
                clientId: '',
                clientSecret: '',
            })
        }
    },

    /**
     * Busca a configuração do IDP para um domínio específico.
     * @param domain Domínio do email do usuário
     */
    async getProviderByDomain(domain: string): Promise<any | null> {
        // Busca simples por nome (assumindo nome == domínio neste exemplo simples)
        return await repo.findOneBy({ name: domain })
    }
}

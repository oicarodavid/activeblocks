import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrOAuthAppEntity } from './oauth-app.entity'
import { apId } from '@activepieces/shared'
import { randomBytes } from 'crypto'

const repo = databaseConnection().getRepository(ZenntrOAuthAppEntity)

// Serviço de Aplicativos OAuth (Clientes Customizados)
export const zenntrOAuthAppService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de OAuth Apps Zenntr Inicializado')
    },

    /**
     * Registra um novo aplicativo OAuth.
     * @param data Dados do aplicativo
     */
    async registerApp(data: { name: string; redirectUris: string[] }): Promise<{ clientId: string; clientSecret: string }> {
        const clientId = 'client_' + randomBytes(8).toString('hex')
        const clientSecret = 'secret_' + randomBytes(16).toString('hex')
        
        await repo.save({
            id: apId(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            displayName: data.name,
            clientId,
            clientSecret, // Nota: Em produção, hash deste segredo deve ser armazenado, não o texto plano
            redirectUris: data.redirectUris,
        })
        
        return { clientId, clientSecret }
    },

    /**
     * Valida as credenciais de um aplicativo cliente.
     * @param clientId ID do cliente
     * @param clientSecret Segredo do cliente
     */
    async validateClient(clientId: string, clientSecret: string): Promise<boolean> {
        const app = await repo.findOneBy({ clientId })
        if (!app) return false
        
        // Comparação segura de tempo constante deve ser usada aqui
        return app.clientSecret === clientSecret
    }
}

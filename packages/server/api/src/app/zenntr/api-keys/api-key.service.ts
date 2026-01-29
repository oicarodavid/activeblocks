import { createHash, randomBytes } from 'crypto'
import { apId } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrApiKey, ZenntrApiKeyEntity } from './api-key.entity'

const repo = databaseConnection().getRepository(ZenntrApiKeyEntity)

// Serviço de Chaves de API
export const zenntrApiKeyService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de API Keys Zenntr Inicializado')
    },

    /**
     * Cria uma nova chave de API.
     * @param projectId ID do projeto
     * @param displayName Nome de exibição
     */
    async create(projectId: string, displayName: string): Promise<{ id: string, apiKey: string }> {
        const key = 'sk_' + randomBytes(24).toString('hex')
        const hashedValue = createHash('sha256').update(key).digest('hex')
        const truncatedValue = key.substring(0, 8) + '...'


        const savedKey = await repo.save({
            id: apId(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            projectId,
            platformId: null, // Pode ser preenchido se a chave for de nível de plataforma
            displayName,
            truncatedValue,
            hashedValue,
        })

        return { id: savedKey.id, apiKey: key }
    },

    /**
     * Verifica uma chave de API.
     * @param apiKey Chave de API bruta
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    async verify(apiKey: string): Promise<ZenntrApiKey | null> {
        const hashedValue = createHash('sha256').update(apiKey).digest('hex')
        const keyEntity = await repo.findOne({ where: { hashedValue } })
        
        if (!keyEntity) return null
        
        // Atualizar 'lastUsedAt' seria ideal aqui se o campo existisse
        
        return keyEntity
    },
}

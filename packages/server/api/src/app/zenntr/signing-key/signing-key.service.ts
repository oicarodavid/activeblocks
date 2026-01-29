import { generateKeyPairSync } from 'crypto'
import { apId } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { ZenntrSigningKey, ZenntrSigningKeyEntity } from './signing-key.entity'

const repo = databaseConnection().getRepository(ZenntrSigningKeyEntity)

// Serviço de Chaves de assinatura (Signing Keys)
export const zenntrSigningKeyService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Signing Keys Zenntr Inicializado')
    },

    /**
     * Gera uma nova chave de assinatura para a plataforma.
     * @param platformId ID da plataforma
     * @param userId ID do usuário gerador
     */
    async generate(platformId: string, userId: string): Promise<{ id: string, publicKey: string, privateKey: string }> {
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 2048,
        })

        const savedKey = await repo.save({
            id: apId(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            platformId,
            publicKey: publicKey.export({ type: 'spki', format: 'pem' }) as string,
            algorithm: 'RSA-SHA256',
            generatedBy: userId,
        })

        return {
            id: savedKey.id,
            publicKey: savedKey.publicKey,
            privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }) as string, 
            // Private key é retornada apenas uma vez e não salva
        }
    },

    /**
     * Lista chaves de assinatura da plataforma.
     * @param platformId ID da plataforma
     */
    async list(platformId: string): Promise<ZenntrSigningKey[]> {
        return repo.find({ where: { platformId } })
    },
}

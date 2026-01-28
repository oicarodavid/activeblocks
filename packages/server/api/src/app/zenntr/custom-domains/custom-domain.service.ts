import { FastifyInstance } from 'fastify'

// Serviço de Domínios Personalizados
export const zenntrCustomDomainService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de Domínios Personalizados Zenntr Inicializado')
    },

    /**
     * Verifica o status de validação de um domínio.
     * @param domain Domínio a verificar
     */
    async verify(domain: string): Promise<boolean> {
        // TODO: Verificar registros DNS
        return false
    }
}

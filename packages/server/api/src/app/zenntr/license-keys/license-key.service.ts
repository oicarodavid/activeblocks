import { FastifyInstance } from 'fastify'

// Serviço de Validação de Licença Zenntr
export const zenntrLicenseKeyService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Licenças Zenntr Inicializado')
    },

    /**
     * Ativa uma licença Zenntr.
     * @param licenseKey Chave de licença
     */
    async activate(_licenseKey: string): Promise<{ valid: boolean, expiresAt: string }> {
        // TODO: Validar licença com servidor de licenças externo
        return { valid: true, expiresAt: '2099-12-31' }
    },

    /**
     * Verifica o status da licença atual.
     */
    async getStatus(): Promise<{ plan: string, active: boolean }> {
        // TODO: Verificar estado local da licença
        return { plan: 'ENTERPRISE', active: true }
    },
}

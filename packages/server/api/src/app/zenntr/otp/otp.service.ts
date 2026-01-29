import { FastifyInstance } from 'fastify'

// Serviço de Senhas de Uso Único (OTP)
export const zenntrOtpService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de OTP Zenntr Inicializado')
    },

    /**
     * Gera um novo código OTP para um usuário ou email.
     * @param email Destinatário
     */
    async generate(_email: string): Promise<{ code: string, ttl: number }> {
        // TODO: Gerar código criptograficamente seguro e salvar no Redis com TTL
        return { code: '123456', ttl: 300 }
    },

    /**
     * Valida um código OTP.
     * @param email Identificador
     * @param code Código a validar
     */
    async verify(_email: string, _code: string): Promise<{ valid: boolean, ttl: number }> {
        // TODO: Comparar com o código armazenado
        return { valid: true, ttl: 0 }
    },
}

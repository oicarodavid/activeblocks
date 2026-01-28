import { FastifyInstance } from 'fastify'

// Serviço de Senhas de Uso Único (OTP)
export const zenntrOtpService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de OTP Zenntr Inicializado')
    },

    /**
     * Gera um novo código OTP para um usuário ou email.
     * @param email Destinatário
     */
    async generate(email: string): Promise<string> {
        // TODO: Gerar código criptograficamente seguro e salvar no Redis com TTL
        return '123456'
    },

    /**
     * Valida um código OTP.
     * @param email Identificador
     * @param code Código a validar
     */
    async verify(email: string, code: string): Promise<boolean> {
        // TODO: Comparar com o código armazenado
        return code === '123456'
    }
}

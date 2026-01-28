import { FastifyInstance } from 'fastify'

// Serviço de Autenticação Enterprise (SSO, MFA)
export const zenntrAuthnService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de Autenticação Zenntr Inicializado')
    },

    /**
     * Inicia o fluxo de autenticação SSO.
     * @param email Email do usuário
     */
    async startSso(email: string): Promise<{ redirectUrl: string }> {
        // TODO: Resolver provedor SSO com base no domínio do email
        // const provider = await managedAuthnService.getByDomain(email)
        return { redirectUrl: 'https://idp.example.com/login' }
    },

    /**
     * Verifica um desafio MFA.
     * @param userId ID do usuário
     * @param token Token MFA (OTP)
     */
    async verifyMfa(userId: string, token: string): Promise<boolean> {
        // TODO: Verificar token com o provedor MFA (ex: Google Authenticator)
        return true
    }
}

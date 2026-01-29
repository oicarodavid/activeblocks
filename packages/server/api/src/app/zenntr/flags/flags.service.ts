import { AppSystemProp } from '@activepieces/server-shared'
import { FastifyInstance } from 'fastify'
import { system } from '../../helper/system/system'

// Serviço de Feature Flags
export const zenntrFlagsService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Feature Flags Zenntr Inicializado')
    },

    /**
     * Verifica se uma flag está habilitada para o contexto atual.
     * @param flagId Nome da flag
     * @param context Contexto (usuário, projeto)
     */
    async isEnabled(flagId: string, _context: Record<string, unknown>): Promise<boolean> {
        // Flags baseadas em variáveis de ambiente para controle global
        if (flagId === 'SHOW_BILLING') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return system.getBoolean((AppSystemProp as any).BILLING_ENABLED) ?? false
        }
        
        // Em um sistema real, aqui chamaríamos um serviço como LaunchDarkly ou Flagsmith
        // Ou consultaríamos uma tabela de 'flags' no banco de dados.
        // Para este Clean Room, usamos controle via ENV e padrões seguros.
        
        return false
    },

    /**
     * Obtém todas as flags ativas para um projeto.
     * @param projectId ID do projeto
     */
    async getAllForProject(_projectId: string): Promise<Record<string, boolean>> {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'isCloud': system.getBoolean((AppSystemProp as any).IS_CLOUD) ?? false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'billingEnabled': system.getBoolean((AppSystemProp as any).BILLING_ENABLED) ?? false,
        }
    },
}

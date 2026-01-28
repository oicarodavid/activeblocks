import { FastifyInstance } from 'fastify'
import { system } from '../../helper/system/system'
import { AppSystemProp } from '@activepieces/server-shared'

// Serviço de Feature Flags
export const zenntrFlagsService = {
    async setup(app: FastifyInstance) {
        app.log.info('Serviço de Feature Flags Zenntr Inicializado')
    },

    /**
     * Verifica se uma flag está habilitada para o contexto atual.
     * @param flagId Nome da flag
     * @param context Contexto (usuário, projeto)
     */
    async isEnabled(flagId: string, context: any): Promise<boolean> {
        // Flags baseadas em variáveis de ambiente para controle global
        if (flagId === 'SHOW_BILLING') {
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
    async getAllForProject(projectId: string): Promise<Record<string, boolean>> {
        return {
            'isCloud': system.getBoolean((AppSystemProp as any).IS_CLOUD) ?? false,
            'billingEnabled': system.getBoolean((AppSystemProp as any).BILLING_ENABLED) ?? false,
        }
    }
}

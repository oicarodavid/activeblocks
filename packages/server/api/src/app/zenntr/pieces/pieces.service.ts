import { FastifyInstance } from 'fastify'
import { system } from '../../helper/system/system'

// Serviço de Gerenciamento de Peças (Pieces)
export const zenntrPiecesService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Peças Zenntr Inicializado')
    },

    /**
     * Filtra a lista de peças disponíveis para um projeto com base nas regras de permissão.
     * @param projectId ID do projeto
     * @param pieces Lista de peças disponíveis globalmente
     */
    async filterForProject(projectId: string, pieces: unknown[]): Promise<unknown[]> {
        // Simulação de regras de allowlist/blocklist
        // Em produção, buscaria as regras do projeto no DB
        const blockedPieces = ['dangerous-piece']
        
        system.globalLogger().info(`[Zenntr Pieces] Filtrando peças para o projeto ${projectId}`)

        return pieces.filter(p => !blockedPieces.includes((p as { name: string }).name))
    },

    /**
     * Instala uma peça privada para um projeto específico.
     * @param projectId ID do projeto
     * @param packageUrl URL do pacote NPM
     */
    async installPrivate(projectId: string, packageUrl: string): Promise<void> {
        // Validação básica
        if (!packageUrl.startsWith('https://registry.npmjs.org') && !packageUrl.endsWith('.tgz')) {
            throw new Error('URL do pacote inválida')
        }
        
        system.globalLogger().info(`[Zenntr Pieces] Instalando peça privada ${packageUrl} para o projeto ${projectId}`)
        // Lógica de instalação via gerenciador de pacotes seria invocada aqui
    },
}

import { apId } from '@activepieces/shared'
import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { databaseConnection } from '../../database/database-connection'
import { system } from '../../helper/system/system'
import { ZenntrPlatformWebhookEntity } from './platform-webhook.entity'

const repo = databaseConnection().getRepository(ZenntrPlatformWebhookEntity)

// Serviço de Webhooks da Plataforma
export const zenntrPlatformWebhooksService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Serviço de Webhooks de Plataforma Zenntr Inicializado')
    },

    /**
   * Dispara eventos para um webhook registrado.
   * @param event Tipo do evento
   * @param payload Dados do evento
   */
    async dispatch(event: string, payload: unknown): Promise<void> {
        const hooks = await repo.find({ where: { enabled: true } })

        for (const hook of hooks) {
            // Verifica se o webhook está inscrito neste evento
            // Assumindo que 'events' é armazenado como JSON array ['event1', 'event2']
            const subscribedEvents = hook.events as unknown as string[]
            if (subscribedEvents.includes(event)) {
                try {
                    await axios.post(hook.url, payload, {
                        headers: {
                            'X-Zenntr-Signature': hook.secret, // TODO: Gerar assinatura HMAC real
                        },
                        timeout: 5000,
                    })
                }
                catch (e) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    system.globalLogger().error(`Falha ao despachar webhook para ${hook.url}`, e as any)
                }
            }
        }
    },

    /**
   * Registra um novo webhook.
   * @param url URL de destino
   * @param events Lista de eventos a escutar
   */
    async register(url: string, events: string[]): Promise<{ id: string }> {
        const id = apId()
        await repo.save({
            id,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            platformId: 'platform_default', // Deveria vir do contexto
            url,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            events: events as any,
            secret: apId(), // Gerar segredo aleatório
            enabled: true,
        })
        return { id }
    },
}

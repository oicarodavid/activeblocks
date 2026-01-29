import { PlatformWebhook } from '@zenntr/shared'
import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart } from '../../database/database-common'

type PlatformWebhookSchema = PlatformWebhook

export const ZenntrPlatformWebhookEntity = new EntitySchema<PlatformWebhookSchema>({
    name: 'zenntr_platform_webhook',
    columns: {
        ...BaseColumnSchemaPart,
        platformId: {
            type: String,
            length: 21,
        },
        url: {
            type: String,
        },
        events: {
            type: 'jsonb',
        },
        secret: {
            type: String,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
    },
})

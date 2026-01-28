import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../../database/database-common'
import { PlatformWebhook, PlatformWebhookEvent } from '@zenntr/shared'

type PlatformWebhookSchema = PlatformWebhook

export const ZenntrPlatformWebhookEntity = new EntitySchema<PlatformWebhookSchema>({
    name: 'zenntr_platform_webhook',
    columns: {
        ...BaseColumnSchemaPart,
        platformId: {
            ...ApIdSchema,
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

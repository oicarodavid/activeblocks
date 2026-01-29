import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrAppCredential = {
    id: string
    created: string
    updated: string
    appName: string
    settings: Record<string, unknown>
}

export const ZenntrAppCredentialEntity = new EntitySchema<ZenntrAppCredential>({
    name: 'zenntr_app_credential',
    columns: {
        ...BaseColumnSchemaPart,
        appName: {
            type: String,
        },
        settings: {
            type: 'jsonb',
        },
    },
})

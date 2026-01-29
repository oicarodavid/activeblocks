import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrApiKey = {
    id: string
    created: string
    updated: string
    projectId: string
    platformId: string | null
    displayName: string
    truncatedValue: string
    hashedValue: string
}

export const ZenntrApiKeyEntity = new EntitySchema<ZenntrApiKey>({
    name: 'zenntr_api_key',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
        },
        platformId: {
            ...ApIdSchema,
            nullable: true,
        },
        displayName: {
            type: String,
        },
        truncatedValue: {
            type: String,
        },
        hashedValue: {
            type: String,
        },
    },
})

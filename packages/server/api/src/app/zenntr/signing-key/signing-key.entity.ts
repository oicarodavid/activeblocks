import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export interface ZenntrSigningKey {
    id: string
    created: string
    updated: string
    platformId: string
    publicKey: string
    algorithm: string
    generatedBy: string
}

export const ZenntrSigningKeyEntity = new EntitySchema<ZenntrSigningKey>({
    name: 'zenntr_signing_key',
    columns: {
        ...BaseColumnSchemaPart,
        platformId: {
            ...ApIdSchema,
        },
        publicKey: {
            type: String,
        },
        algorithm: {
            type: String,
        },
        generatedBy: {
            ...ApIdSchema,
            nullable: true,
        },
    },
})

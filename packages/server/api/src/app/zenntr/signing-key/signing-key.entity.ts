import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrSigningKey = {
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
            type: String,
            length: 21,
        },
        publicKey: {
            type: String,
        },
        algorithm: {
            type: String,
        },
        generatedBy: {
            type: String,
            length: 21,
            nullable: true,
        },
    },
})

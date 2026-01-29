import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrPlatformConfig = {
    id: string
    created: string
    updated: string
    key: string
    value: unknown
}

export const ZenntrPlatformConfigEntity = new EntitySchema<ZenntrPlatformConfig>({
    name: 'zenntr_platform_config',
    columns: {
        ...BaseColumnSchemaPart,
        key: {
            type: String,
        },
        value: {
            type: 'jsonb',
            nullable: true,
        },
    },
})

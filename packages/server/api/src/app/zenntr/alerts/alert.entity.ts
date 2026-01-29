import { SystemAlert } from '@zenntr/shared'
import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrAlert = SystemAlert & {
    created: string
    updated: string
    projectId: string
}

export const ZenntrAlertEntity = new EntitySchema<ZenntrAlert>({
    name: 'zenntr_alert',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
        },
        severity: {
            type: String,
        },
        message: {
            type: String, // TypeORM 'text' is default for String or specify type: 'text'
        },
        readAt: {
            type: 'timestamp',
            nullable: true,
        },
        data: {
            type: 'jsonb',
            nullable: true,
        },
    },
})

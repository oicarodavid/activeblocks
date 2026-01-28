import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../../database/database-common'
import { Alert, AlertSeverity } from '@zenntr/shared'

type AlertSchema = Alert

export const ZenntrAlertEntity = new EntitySchema<AlertSchema>({
    name: 'zenntr_alert',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
        },
        severity: {
            type: String,
            enum: Object.values(AlertSeverity),
        },
        message: {
            type: String,
        },
        data: {
            type: 'jsonb',
            nullable: true,
        },
        readAt: {
            type: 'timestamp with time zone',
            nullable: true,
        },
    },
    indices: [
        {
            name: 'idx_zenntr_alert_project_id',
            columns: ['projectId'],
        },
    ],
})

import { AuditEvent } from '@zenntr/shared'
import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrAuditEvent = AuditEvent & {
    created: string
    updated: string
}

export const ZenntrAuditEventEntity = new EntitySchema<ZenntrAuditEvent>({
    name: 'zenntr_audit_event',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
        },
        userId: {
            ...ApIdSchema,
        },
        action: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        details: {
            type: 'jsonb',
            nullable: true,
        },
    },
})

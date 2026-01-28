import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export interface ZenntrAuditEvent {
    id: string
    created: string
    updated: string
    platformId: string
    projectId: string
    userId: string
    event: string
    ip: string
    data: unknown
}

export const ZenntrAuditEventEntity = new EntitySchema<ZenntrAuditEvent>({
    name: 'zenntr_audit_event',
    columns: {
        ...BaseColumnSchemaPart,
        platformId: {
            ...ApIdSchema,
        },
        projectId: {
            ...ApIdSchema,
            nullable: true,
        },
        userId: {
            ...ApIdSchema,
        },
        event: {
            type: String,
        },
        ip: {
            type: String,
            nullable: true,
        },
        data: {
            type: 'jsonb',
        },
    },
})

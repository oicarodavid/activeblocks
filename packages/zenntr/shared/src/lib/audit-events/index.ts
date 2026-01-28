import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

export enum AuditEventType {
    USER_SIGNED_IN = 'USER_SIGNED_IN',
    USER_SIGNED_OUT = 'USER_SIGNED_OUT',
    FLOW_CREATED = 'FLOW_CREATED',
    FLOW_DELETED = 'FLOW_DELETED',
    FLOW_UPDATED = 'FLOW_UPDATED',
    PROJECT_MEMBER_ADDED = 'PROJECT_MEMBER_ADDED',
    PROJECT_MEMBER_REMOVED = 'PROJECT_MEMBER_REMOVED',
}

export const AuditEvent = Type.Object({
    ...BaseModelSchema,
    action: Type.Enum(AuditEventType),
    projectId: Type.String(),
    userId: Type.String(),
    userEmail: Type.String(),
    ip: Type.Optional(Type.String()),
    data: Type.Optional(Type.Any()),
})

export type AuditEvent = Static<typeof AuditEvent>

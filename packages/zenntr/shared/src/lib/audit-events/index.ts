import { Static, Type } from '@sinclair/typebox'

export const AuditEventType = Type.Union([
    Type.Literal('USER_LOGIN'),
    Type.Literal('FLOW_CREATED'),
    Type.Literal('FLOW_DELETED'),
    Type.Literal('CONNECTION_UPDATED'),
    Type.Literal('PROJECT_MEMBER_ADDED'),
])

export type AuditEvent = {
    id: string
    projectId: string
    userId: string
    action: Static<typeof AuditEventType>
    ipAddress: string
    userAgent: string
    created: string // Renamed from timestamp
    updated: string
    details: Record<string, unknown>
}

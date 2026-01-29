import { Static, Type } from '@sinclair/typebox'

export enum AlertSeverity {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
}

export const AlertSchema = Type.Object({
    id: Type.String(),
    projectId: Type.String(),
    severity: Type.Enum(AlertSeverity),
    message: Type.String(),
    readAt: Type.Optional(Type.String()),
    data: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
    created: Type.String(),
    updated: Type.String(),
})

export type SystemAlert = Static<typeof AlertSchema>

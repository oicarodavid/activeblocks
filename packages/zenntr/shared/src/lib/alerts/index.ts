import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

// Define os tipos de severidade para os alertas do sistema
export enum AlertSeverity {
    INFO = 'INFO',
    WARNING = 'WARNING',
    CRITICAL = 'CRITICAL',
}

// Define o esquema para o objeto de Alerta
export const Alert = Type.Object({
    ...BaseModelSchema,
    projectId: Type.String(),
    severity: Type.Enum(AlertSeverity),
    message: Type.String(),
    data: Type.Optional(Type.Any()),
    readAt: Type.Optional(Type.String()),
})

export type Alert = Static<typeof Alert>

// Define a requisição para criação de um alerta (interno)
export const CreateAlertRequest = Type.Object({
    projectId: Type.String(),
    severity: Type.Enum(AlertSeverity),
    message: Type.String(),
    data: Type.Optional(Type.Any()),
})

export type CreateAlertRequest = Static<typeof CreateAlertRequest>

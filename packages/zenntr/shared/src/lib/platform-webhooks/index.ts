import { BaseModelSchema } from '@activepieces/shared'
import { Static, Type } from '@sinclair/typebox'

// Enumeração dos eventos que disparam webhooks da plataforma
export enum PlatformWebhookEvent {
    PROJECT_CREATED = 'PROJECT_CREATED',
    PROJECT_DELETED = 'PROJECT_DELETED',
    USER_CREATED = 'USER_CREATED',
    USER_DELETED = 'USER_DELETED',
    BILLING_LIMIT_REACHED = 'BILLING_LIMIT_REACHED',
}

// Define o esquema para o objeto PlatformWebhook
export const PlatformWebhook = Type.Object({
    ...BaseModelSchema,
    platformId: Type.String(),
    url: Type.String(),
    events: Type.Array(Type.Enum(PlatformWebhookEvent)),
    secret: Type.String(),
    enabled: Type.Boolean(),
})

export type PlatformWebhook = Static<typeof PlatformWebhook>

// Requisição para criar um webhook de plataforma
export const CreatePlatformWebhookRequest = Type.Object({
    url: Type.String(),
    events: Type.Array(Type.Enum(PlatformWebhookEvent)),
})

export type CreatePlatformWebhookRequest = Static<typeof CreatePlatformWebhookRequest>

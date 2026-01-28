import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

export const ApiKey = Type.Object({
    ...BaseModelSchema,
    displayName: Type.String(),
    platformId: Type.String(),
    truncatedValue: Type.String(),
    hashedValue: Type.String(),
})

export type ApiKey = Static<typeof ApiKey>

export const CreateApiKeyRequest = Type.Object({
    displayName: Type.String(),
})

export type CreateApiKeyRequest = Static<typeof CreateApiKeyRequest>

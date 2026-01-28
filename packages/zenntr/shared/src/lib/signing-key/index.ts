import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

export const SigningKey = Type.Object({
    ...BaseModelSchema,
    displayName: Type.String(),
    publicKey: Type.String(),
    projectId: Type.String(),
})

export type SigningKey = Static<typeof SigningKey>

export const CreateSigningKeyRequest = Type.Object({
    displayName: Type.String(),
})

export type CreateSigningKeyRequest = Static<typeof CreateSigningKeyRequest>

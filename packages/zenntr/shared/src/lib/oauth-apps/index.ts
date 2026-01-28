import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

export const OAuthApp = Type.Object({
    ...BaseModelSchema,
    displayName: Type.String(),
    clientId: Type.String(),
    clientSecret: Type.String(), // Should be hashed or protected in real implementation
    redirectUris: Type.Array(Type.String()),
})

export type OAuthApp = Static<typeof OAuthApp>

export const CreateOAuthAppRequest = Type.Object({
    displayName: Type.String(),
    redirectUris: Type.Array(Type.String()),
})

export type CreateOAuthAppRequest = Static<typeof CreateOAuthAppRequest>

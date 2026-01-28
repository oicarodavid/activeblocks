import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

export const ManagedAuthnProvider = Type.Object({
    ...BaseModelSchema,
    name: Type.String(),
    authUrl: Type.String(),
    tokenUrl: Type.String(),
    clientId: Type.String(),
    clientSecret: Type.String(),
})

export type ManagedAuthnProvider = Static<typeof ManagedAuthnProvider>

export const CreateManagedAuthnProviderRequest = Type.Object({
    name: Type.String(),
    authUrl: Type.String(),
    tokenUrl: Type.String(),
    clientId: Type.String(),
    clientSecret: Type.String(),
})

export type CreateManagedAuthnProviderRequest = Static<typeof CreateManagedAuthnProviderRequest>

import { Static, Type } from '@sinclair/typebox'

export enum AuthenticationType {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE',
    GITHUB = 'GITHUB',
    SAML = 'SAML', // Enterprise feature
    OIDC = 'OIDC', // Enterprise feature
}

export const FederatedAuthnProvider = Type.Object({
    name: Type.String(),
    authUrl: Type.String(),
    icon: Type.Optional(Type.String()),
})

export type FederatedAuthnProvider = Static<typeof FederatedAuthnProvider>

export const SsoConfiguration = Type.Object({
    idpMetadataUrl: Type.String(),
    acsUrl: Type.String(),
    entityId: Type.String(),
})

export type SsoConfiguration = Static<typeof SsoConfiguration>

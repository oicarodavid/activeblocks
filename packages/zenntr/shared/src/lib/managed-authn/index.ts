import { Static, Type } from '@sinclair/typebox'

export const ManagedAuthnProvider = Type.Union([
    Type.Literal('GOOGLE'),
    Type.Literal('GITHUB'),
    Type.Literal('SAML'),
    Type.Literal('OIDC'),
])

export type ManagedAuthnConfig = {
    id: string
    domain: string // e.g. company.com
    provider: Static<typeof ManagedAuthnProvider>
    config: Record<string, unknown>
}

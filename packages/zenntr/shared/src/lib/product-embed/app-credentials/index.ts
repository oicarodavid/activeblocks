import { Static, Type } from '@sinclair/typebox'

export const AppCredentialType = Type.Union([
    Type.Literal('OAUTH2'),
    Type.Literal('API_KEY'),
    Type.Literal('BASIC_AUTH'),
    Type.Literal('CUSTOM'),
])

export type AppCredential = {
    id: string
    appName: string
    type: Static<typeof AppCredentialType>
    settings: Record<string, unknown>
    created: string
    updated: string
}

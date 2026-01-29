import { Static, Type } from '@sinclair/typebox'

export const GenerateConnectionKeyRequest = Type.Object({
    projectId: Type.String(),
    expiresInSeconds: Type.Number({ minimum: 60 }),
})

export type GenerateConnectionKeyRequest = Static<typeof GenerateConnectionKeyRequest>

export type ConnectionKey = {
    id: string
    projectId: string
    publicKey: string
    created: string
}

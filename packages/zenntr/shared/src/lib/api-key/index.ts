import { Static, Type } from '@sinclair/typebox'

export const CreateApiKeyRequest = Type.Object({
    name: Type.String(),
})

export type CreateApiKeyRequest = Static<typeof CreateApiKeyRequest>

export type ApiKey = {
    id: string
    projectId: string
    name: string
    truncatedKey: string
    created: string
}

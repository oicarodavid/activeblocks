import { Static, Type } from '@sinclair/typebox'

export const EventDestinationType = Type.Union([
    Type.Literal('WEBHOOK'),
    Type.Literal('SEGMENT'),
    Type.Literal('DATADOG'),
])

export type EventDestination = {
    id: string
    projectId: string
    type: Static<typeof EventDestinationType>
    config: Record<string, unknown>
    enabled: boolean
    created: string
    updated: string
}

export const CreateEventDestinationRequest = Type.Object({
    type: EventDestinationType,
    config: Type.Record(Type.String(), Type.Unknown()),
})

export type CreateEventDestinationRequest = Static<typeof CreateEventDestinationRequest>

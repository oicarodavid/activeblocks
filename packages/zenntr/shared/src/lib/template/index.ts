import { Static, Type } from '@sinclair/typebox'

export const TemplateType = Type.Union([
    Type.Literal('PLATFORM'),
    Type.Literal('PROJECT'),
    Type.Literal('COMMUNITY'),
])

export type Template = {
    id: string
    name: string
    description?: string
    type: Static<typeof TemplateType>
    content: Record<string, unknown> // Flow definition
    flow?: Record<string, unknown>
    projectId?: string | null
    platformId?: string | null
    tags?: string[]
    created: string
    updated: string
}

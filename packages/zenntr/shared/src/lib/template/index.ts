import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

// Define o tipo de template (público ou privado/projeto)
export enum TemplateType {
    PLATFORM = 'PLATFORM',
    PROJECT = 'PROJECT',
}

// Define o esquema para o objeto Template
export const Template = Type.Object({
    ...BaseModelSchema,
    name: Type.String(),
    description: Type.Optional(Type.String()),
    type: Type.Enum(TemplateType),
    projectId: Type.Optional(Type.String()),
    platformId: Type.Optional(Type.String()),
    flow: Type.Any(), // Definição do fluxo serializada
    tags: Type.Array(Type.String()),
})

export type Template = Static<typeof Template>

// Requisição para criar um novo template
export const CreateTemplateRequest = Type.Object({
    name: Type.String(),
    description: Type.Optional(Type.String()),
    flow: Type.Any(),
    tags: Type.Optional(Type.Array(Type.String())),
})

export type CreateTemplateRequest = Static<typeof CreateTemplateRequest>

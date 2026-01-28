import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../../database/database-common'
import { Template, TemplateType } from '@zenntr/shared'

type TemplateSchema = Template

export const ZenntrTemplateEntity = new EntitySchema<TemplateSchema>({
    name: 'zenntr_template',
    columns: {
        ...BaseColumnSchemaPart,
        name: {
            type: String,
        },
        description: {
            type: String,
            nullable: true,
        },
        type: {
            type: String,
            enum: Object.values(TemplateType),
        },
        projectId: {
            ...ApIdSchema,
            nullable: true,
        },
        platformId: {
            ...ApIdSchema,
            nullable: true,
        },
        flow: {
            type: 'jsonb',
        },
        tags: {
            type: 'jsonb',
        },
    },
})

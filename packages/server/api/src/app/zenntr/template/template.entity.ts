import { Template, TemplateType } from '@zenntr/shared'
import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart } from '../../database/database-common'

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
            type: String,
            length: 21,
            nullable: true,
        },
        platformId: {
            type: String,
            length: 21,
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

import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrCustomDomain = {
    id: string
    created: string
    updated: string
    domain: string
    projectId: string
    status: string
    txtRecord: string
}

export const ZenntrCustomDomainEntity = new EntitySchema<ZenntrCustomDomain>({
    name: 'zenntr_custom_domain',
    columns: {
        ...BaseColumnSchemaPart,
        domain: {
            type: String,
            unique: true,
        },
        projectId: {
            ...ApIdSchema,
        },
        status: {
            type: String,
        },
        txtRecord: {
            type: String,
            nullable: true,
        },
    },
})

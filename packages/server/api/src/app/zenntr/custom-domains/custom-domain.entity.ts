import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export interface ZenntrCustomDomain {
    id: string
    created: string
    updated: string
    platformId: string
    domain: string
    status: 'PENDING' | 'ACTIVE' | 'FAILED'
}

export const ZenntrCustomDomainEntity = new EntitySchema<ZenntrCustomDomain>({
    name: 'zenntr_custom_domain',
    columns: {
        ...BaseColumnSchemaPart,
        platformId: {
            ...ApIdSchema,
        },
        domain: {
            type: String,
            unique: true,
        },
        status: {
            type: String,
        },
    },
})

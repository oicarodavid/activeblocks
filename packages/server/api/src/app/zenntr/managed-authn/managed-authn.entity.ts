import { ManagedAuthnConfig } from '@zenntr/shared'
import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrManagedAuthn = {
    id: string
    created: string
    updated: string
    domain: string
    provider: string
    config: ManagedAuthnConfig
}

export const ZenntrManagedAuthnEntity = new EntitySchema<ZenntrManagedAuthn>({
    name: 'zenntr_managed_authn',
    columns: {
        ...BaseColumnSchemaPart,
        domain: {
            type: String,
        },
        provider: {
            type: String,
        },
        config: {
            type: 'jsonb',
        },
    },
})

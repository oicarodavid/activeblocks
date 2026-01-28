import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../../database/database-common'
import { ManagedAuthnProvider } from '@zenntr/shared'

type ManagedAuthnProviderSchema = ManagedAuthnProvider

export const ZenntrManagedAuthnEntity = new EntitySchema<ManagedAuthnProviderSchema>({
    name: 'zenntr_managed_authn_provider',
    columns: {
        ...BaseColumnSchemaPart,
        name: {
            type: String,
        },
        authUrl: {
            type: String,
        },
        tokenUrl: {
            type: String,
        },
        clientId: {
            type: String,
        },
        clientSecret: {
            type: String,
        },
    },
})

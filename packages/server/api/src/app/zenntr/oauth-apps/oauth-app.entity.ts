import { OAuthApp } from '@zenntr/shared'
import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart } from '../../database/database-common'

type OAuthAppSchema = OAuthApp

export const ZenntrOAuthAppEntity = new EntitySchema<OAuthAppSchema>({
    name: 'zenntr_oauth_app',
    columns: {
        ...BaseColumnSchemaPart,
        displayName: {
            type: String,
        },
        clientId: {
            type: String,
            unique: true,
        },
        clientSecret: {
            type: String,
        },
        redirectUris: {
            type: 'jsonb', // Array de strings armazenado como JSON
        },
    },
})

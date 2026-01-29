import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrOtp = {
    id: string
    created: string
    updated: string
    userId: string
    type: string
    value: string
    state: string
}

export const ZenntrOtpEntity = new EntitySchema<ZenntrOtp>({
    name: 'zenntr_otp',
    columns: {
        ...BaseColumnSchemaPart,
        userId: {
            ...ApIdSchema,
        },
        type: {
            type: String, // email_verification, password_reset
        },
        value: {
            type: String,
        },
        state: {
            type: String, // PENDING, CONFIRMED
            default: 'PENDING',
        },
    },
})

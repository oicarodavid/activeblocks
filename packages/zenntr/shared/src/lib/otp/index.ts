import { Static, Type } from '@sinclair/typebox'

export enum OtpType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
}

export const VerifyOtpRequest = Type.Object({
    email: Type.String(),
    otp: Type.String(),
    type: Type.Enum(OtpType),
})

export type VerifyOtpRequest = Static<typeof VerifyOtpRequest>

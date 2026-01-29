export type OtpState = {
    id: string
    userId: string
    verified: boolean
    expiresAt: string
}

export type VerifyOtpRequest = {
    userId: string
    code: string
}

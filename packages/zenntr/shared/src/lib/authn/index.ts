export type AuthenticationResponse = {
    token: string
    user: {
        id: string
        email: string
        firstName: string
        lastName: string
    }
    projectId?: string
}

export type SsoLoginRequest = {
    provider: string // 'google', 'github', 'saml'
    redirectUrl?: string
}

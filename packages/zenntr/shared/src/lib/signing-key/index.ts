export type SigningKey = {
    id: string
    publicKey: string
    algorithm: string
    created: string
}

export type JwkSet = {
    keys: Record<string, unknown>[]
}

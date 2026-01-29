export enum CustomDomainStatus {
    PENDING = 'PENDING',
    active = 'ACTIVE',
    FAILED = 'FAILED',
}

export type CustomDomain = {
    id: string
    domain: string
    projectId: string
    status: string // string or CustomDomainStatus
    txtRecord: string
    created: string
    updated: string
}

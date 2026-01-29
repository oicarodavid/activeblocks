export enum ProjectMemberRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER',
    OPERATOR = 'OPERATOR',
}

export enum ProjectMemberStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
}

export type ProjectMember = {
    id: string
    projectId: string
    userId?: string
    email: string
    role: ProjectMemberRole
    status: ProjectMemberStatus
    created: string
    updated: string
}

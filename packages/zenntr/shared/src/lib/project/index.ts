import { BaseModelSchema, Project, ProjectWithLimits } from '@activepieces/shared'

import { Static, Type } from '@sinclair/typebox'

export enum ProjectRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER',
    OPERATOR = 'OPERATOR',
}

export const ProjectMember = Type.Object({
    ...BaseModelSchema,
    projectId: Type.String(),
    userId: Type.String(),
    role: Type.Enum(ProjectRole),
    status: Type.String(),
})

export type ProjectMember = Static<typeof ProjectMember>

export const UpdateProjectRequest = Type.Object({
    displayName: Type.Optional(Type.String()),
    plan: Type.Optional(Type.Any()), 
    notifyStatus: Type.Optional(Type.String()),
})

export type UpdateProjectRequest = Static<typeof UpdateProjectRequest>

export const ProjectUsage = Type.Object({
    id: Type.String(),
    projectId: Type.String(),
    flowRuns: Type.Number(),
    activeFlows: Type.Number(),
    teamMembers: Type.Number(),
    connections: Type.Number(),
    nextResetAt: Type.String(),
    created: Type.String(),
    updated: Type.String(),
})

export type ProjectUsage = Static<typeof ProjectUsage>

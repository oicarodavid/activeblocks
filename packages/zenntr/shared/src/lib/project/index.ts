import { Static, Type } from '@sinclair/typebox'
import { Project, ProjectWithLimits } from '@activepieces/shared'
import { BaseModelSchema } from '@activepieces/shared'

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

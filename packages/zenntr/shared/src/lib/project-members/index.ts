import { Static, Type } from '@sinclair/typebox'
import { ProjectRole } from '../project'
import { BaseModelSchema } from '@activepieces/shared'

export const SendInvitationRequest = Type.Object({
    email: Type.String({ format: 'email' }),
    role: Type.Enum(ProjectRole),
})

export type SendInvitationRequest = Static<typeof SendInvitationRequest>

export const Invitation = Type.Object({
    ...BaseModelSchema,
    email: Type.String(),
    projectId: Type.String(),
    role: Type.Enum(ProjectRole),
    accepted: Type.Boolean(),
    expiresAt: Type.Number(),
})

export type Invitation = Static<typeof Invitation>

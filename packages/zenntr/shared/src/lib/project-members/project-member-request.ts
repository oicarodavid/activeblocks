import { Static, Type } from '@sinclair/typebox';
import { ProjectMemberRole } from './project-member';

export const SendInvitationRequest = Type.Object({
    email: Type.String({ format: 'email' }),
    role: Type.Enum(ProjectMemberRole),
});

export type SendInvitationRequest = Static<typeof SendInvitationRequest>;

export const AcceptInvitationRequest = Type.Object({
    token: Type.String(),
});

export type AcceptInvitationRequest = Static<typeof AcceptInvitationRequest>;

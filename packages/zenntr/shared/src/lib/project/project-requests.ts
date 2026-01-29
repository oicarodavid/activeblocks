import { Static, Type } from '@sinclair/typebox';

export const CreateProjectRequest = Type.Object({
    displayName: Type.String(),
    externalId: Type.Optional(Type.String()),
});

export type CreateProjectRequest = Static<typeof CreateProjectRequest>;

export const UpdateProjectRequest = Type.Object({
    displayName: Type.Optional(Type.String()),
    notifyStatus: Type.Optional(Type.String()),
});

export type UpdateProjectRequest = Static<typeof UpdateProjectRequest>;

import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

export const GitRepo = Type.Object({
    ...BaseModelSchema,
    remoteUrl: Type.String(),
    branch: Type.String(),
    projectId: Type.String(),
    sshPrivateKey: Type.String(),
})

export type GitRepo = Static<typeof GitRepo>

export const GitPushRequest = Type.Object({
    commitMessage: Type.String(),
})

export type GitPushRequest = Static<typeof GitPushRequest>

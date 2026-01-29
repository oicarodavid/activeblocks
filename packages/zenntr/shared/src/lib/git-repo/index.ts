import { Static, Type } from '@sinclair/typebox'

export const GitSyncStatus = Type.Union([
    Type.Literal('SYNCED'),
    Type.Literal('OUT_OF_SYNC'),
    Type.Literal('ERROR'),
])

export type GitRepoConfig = {
    id: string
    projectId: string
    remoteUrl: string
    branch: string
    sshKey: string
    created: string
    updated: string
}

export type GitSyncState = {
    projectId: string
    status: Static<typeof GitSyncStatus>
    lastSync: string
    commitHash?: string
}

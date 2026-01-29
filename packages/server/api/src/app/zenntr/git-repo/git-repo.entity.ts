import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrGitRepo = {
    id: string
    created: string
    updated: string
    projectId: string
    remoteUrl: string
    branch: string
    sshPrivateKey: string
    slug: string
}

export const ZenntrGitRepoEntity = new EntitySchema<ZenntrGitRepo>({
    name: 'zenntr_git_repo',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
            unique: true,
        },
        remoteUrl: {
            type: String,
        },
        branch: {
            type: String,
        },
        sshPrivateKey: {
            type: String,
            select: false,
        },
        slug: {
            type: String,
        },
    },
})

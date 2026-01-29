import { ProjectReleaseType } from '@activepieces/shared'
import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrProjectRelease = {
    id: string
    created: string
    updated: string
    projectId: string
    type: ProjectReleaseType
    gitCommitId: string
    report: unknown
}

export const ZenntrProjectReleaseEntity = new EntitySchema<ZenntrProjectRelease>({
    name: 'zenntr_project_release',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
        },
        type: {
            type: String,
        },
        gitCommitId: {
            type: String,
        },
        report: {
            type: 'jsonb',
        },
    },
})

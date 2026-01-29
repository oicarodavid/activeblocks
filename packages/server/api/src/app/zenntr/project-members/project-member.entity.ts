import { ProjectRole } from '@zenntr/shared'
import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrProjectMember = {
    id: string
    created: string
    updated: string
    projectId: string
    userId: string
    role: ProjectRole
    status: 'ACTIVE' | 'INVITED'
}

export const ZenntrProjectMemberEntity = new EntitySchema<ZenntrProjectMember>({
    name: 'zenntr_project_member',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
        },
        userId: {
            ...ApIdSchema,
        },
        role: {
            type: String,
            enum: Object.values(ProjectRole),
        },
        status: {
            type: String,
            default: 'ACTIVE',
        },
    },
    indices: [
        {
            name: 'idx_zenntr_project_member_project_user',
            columns: ['projectId', 'userId'],
            unique: true,
        },
    ],
})

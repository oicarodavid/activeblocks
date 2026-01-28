import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export interface ZenntrProjectPlan {
    id: string
    created: string
    updated: string
    projectId: string
    name: string
    flowRuns: number
    activeFlows: number
    connections: number
    teamMembers: number
}

export const ZenntrProjectPlanEntity = new EntitySchema<ZenntrProjectPlan>({
    name: 'zenntr_project_plan',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            ...ApIdSchema,
            unique: true,
        },
        name: {
            type: String,
        },
        flowRuns: {
            type: Number,
        },
        activeFlows: {
            type: Number,
        },
        connections: {
            type: Number,
        },
        teamMembers: {
            type: Number,
        },
    },
})

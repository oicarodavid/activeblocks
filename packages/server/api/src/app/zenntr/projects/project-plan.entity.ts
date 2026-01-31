import { EntitySchema } from 'typeorm'
import { BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrProjectPlan = {
    id: string
    created: string
    updated: string
    projectId: string
    name: string
    flowRuns: number
    activeFlows: number
    connections: number
    teamMembers: number
    piecesFilterType?: string | null
    pieces?: unknown
    tasks?: number | null
    aiCredits?: number | null
}

export const ZenntrProjectPlanEntity = new EntitySchema<ZenntrProjectPlan>({
    name: 'zenntr_project_plan',
    columns: {
        ...BaseColumnSchemaPart,
        projectId: {
            type: String,
            length: 21,
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
        piecesFilterType: {
            type: String,
            nullable: true,
        },
        pieces: {
            type: 'jsonb',
            nullable: true,
        },
        tasks: {
            type: Number,
            nullable: true,
        },
        aiCredits: {
            type: Number,
            nullable: true,
        },
    },
})

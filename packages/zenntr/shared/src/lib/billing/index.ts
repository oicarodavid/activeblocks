import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

export enum PlanType {
    FREE = 'FREE',
    PRO = 'PRO',
    ENTERPRISE = 'ENTERPRISE',
}

export const ProjectUsage = Type.Object({
    ...BaseModelSchema,
    projectId: Type.String(),
    flowRuns: Type.Number(),
    activeFlows: Type.Number(),
    teamMembers: Type.Number(),
    connections: Type.Number(),
    nextResetAt: Type.String(), // ISO date
})

export type ProjectUsage = Static<typeof ProjectUsage>

export const ProjectPlanLimits = Type.Object({
    flowRuns: Type.Number(),
    activeFlows: Type.Number(),
    teamMembers: Type.Number(),
    tasks: Type.Number(),
})

export type ProjectPlanLimits = Static<typeof ProjectPlanLimits>

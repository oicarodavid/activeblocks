import { Static, Type } from '@sinclair/typebox'

export const PlanType = Type.Union([
    Type.Literal('FREE'),
    Type.Literal('PRO'),
    Type.Literal('ENTERPRISE'),
])

export type BillingUsage = {
    projectId: string
    flowExecutions: number
    connections: number
    periodStart: string
    periodEnd: string
}

export type BillingPlan = {
    id: string
    name: Static<typeof PlanType>
    limits: {
        tasks: number
        users: number
        connections: number
    }
}

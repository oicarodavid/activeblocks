import { EntitySchema } from 'typeorm'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

export type ZenntrPlatformAnalyticsReport = {
    id: string
    created: string
    updated: string
    platformId: string
    data: unknown
}

export const ZenntrPlatformAnalyticsReportEntity = new EntitySchema<ZenntrPlatformAnalyticsReport>({
    name: 'zenntr_platform_analytics_report',
    columns: {
        ...BaseColumnSchemaPart,
        platformId: {
            ...ApIdSchema,
        },
        data: {
            type: 'jsonb',
        },
    },
})

import { Static, Type } from '@sinclair/typebox'
import { BaseModelSchema } from '@activepieces/shared'

export const CustomDomain = Type.Object({
    ...BaseModelSchema,
    domain: Type.String(),
    platformId: Type.String(),
    status: Type.String(),
})

export type CustomDomain = Static<typeof CustomDomain>

export const CreateCustomDomainRequest = Type.Object({
    domain: Type.String(),
})

export type CreateCustomDomainRequest = Static<typeof CreateCustomDomainRequest>

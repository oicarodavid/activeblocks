import { AuthenticationResponse } from '@activepieces/shared'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { applicationEvents } from '../../helper/application-events'
import { federatedAuthService } from '../authn/federated-auth.service'

const ManagedAuthnRequest = {
    schema: {
        body: {
            type: 'object',
            properties: {
                externalAccessToken: { type: 'string' },
            },
            required: ['externalAccessToken'],
        },
    },
} as const

export const zenntrManagedAuthnController: FastifyPluginAsyncTypebox = async (app) => {
    app.post(
        '/external-token',
        ManagedAuthnRequest,
        async (req): Promise<AuthenticationResponse> => {
            const { externalAccessToken } = req.body as { externalAccessToken: string }

            // Reuse the existing federated auth logic but use the token passed in body
            const response = await federatedAuthService.exchangeToken({
                externalToken: externalAccessToken,
            })

            applicationEvents(req.log).sendUserEvent(req, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                action: 'user.signed.up' as any,
                data: {
                    source: 'managed',
                },
            })
            return response
        },
    )
}

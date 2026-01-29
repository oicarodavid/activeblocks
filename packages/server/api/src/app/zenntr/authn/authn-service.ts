import * as crypto from 'crypto'
import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import * as jwt from 'jsonwebtoken'
import { system } from '../../helper/system/system'
import { projectService } from '../../project/project-service'
import { userService } from '../../user/user-service'
import { zenntrManagedAuthnService } from '../managed-authn/managed-authn.service'
import { federatedAuthService } from './federated-auth.service'

export const zenntrAuthnService = {
    async setup(app: FastifyInstance): Promise<void> {
        app.log.info('Zenntr Authentication Service Initialized')
        
        app.post('/v1/authn/federated/token', {
            schema: {
                body: Type.Object({
                    externalToken: Type.String(),
                }),
            },
        }, async (req) => {
            const { externalToken } = req.body as { externalToken: string }
            return federatedAuthService.exchangeToken({ externalToken })
        })

        // Temporary Verification Endpoint
        app.post('/v1/authn/federated/verify-setup', async (req, reply) => {
            try {
                // 1. Generate Keys
                const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 2048,
                })
                const publicKeyPem = publicKey.export({ type: 'pkcs1', format: 'pem' }).toString()
                const privateKeyPem = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString()

                // 2. Mock Env
                process.env['AP_ZENNTR_PUBLIC_KEY'] = publicKeyPem

                const tenantId = crypto.randomUUID()
                const email = `test-user-${crypto.randomUUID()}@example.com`

                const payload = {
                    email,
                    tenantId,
                    role: 'ADMIN',
                    firstName: 'Test',
                    lastName: 'User',
                    sub: email,
                    name: 'Test User',
                }

                // 3. Sign Token
                const externalToken = jwt.sign(payload, privateKeyPem, { algorithm: 'RS256' })

                // 4. Exchange
                const result = await federatedAuthService.exchangeToken({ externalToken })

                // 5. Verify DB
                const identityService = await import('../../authentication/user-identity/user-identity-service').then(m => m.userIdentityService(system.globalLogger()))
                const identity = await identityService.getIdentityByEmail(email)
                
                if (!identity) throw new Error('Identity not found')

                const user = await userService.getOneByIdentityIdOnly({ identityId: identity.id })
                
                if (!user) throw new Error('User not found in DB')
                if (!user.platformId) throw new Error('User platformId missing')

                const project = await projectService.getByPlatformIdAndExternalId({
                    platformId: user.platformId,
                    externalId: tenantId,
                })
                
                if (!project) throw new Error('Project not found in DB')

                return {
                    success: true,
                    user: { id: user.id, email },
                    project: { id: project.id, externalId: project.externalId },
                    token: result.token,
                }
            }
            catch (e) {
                const error = e as Error
                app.log.error(error)
                return reply.status(500).send({ success: false, error: error.message, stack: error.stack })
            }
        })

        // Exemplo: Registrar rotas de SSO
        app.get('/auth/sso/login', async (req, reply) => {
            const { email } = req.query as { email: string }
            const domain = email.split('@')[1]
            
            const idp = await zenntrManagedAuthnService.getByDomain(domain)
            if (idp) {
                // Redirecionar para IDP
                return reply.redirect(`/auth/sso/${idp.provider}?domain=${domain}`, 302)
            }
            
            return reply.status(404).send({ message: 'SSO not configured for this domain' })
        })
    },
}

import {
    ActivepiecesError,
    DefaultProjectRole,
    ErrorCode,
    PlatformRole,
    PrincipalType,
    ProjectType,
    UserIdentityProvider,
} from '@activepieces/shared'
import * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { userIdentityService } from '../../authentication/user-identity/user-identity-service'
import { projectMemberService } from '../../ee/projects/project-members/project-member.service'
import { JwtSignAlgorithm, jwtUtils } from '../../helper/jwt-utils'
import { system } from '../../helper/system/system'
import { platformService } from '../../platform/platform.service'
import { projectService } from '../../project/project-service'
import { userService } from '../../user/user-service'

type ExchangeTokenParams = {
    externalToken: string
}

type ExternalTokenPayload = {
    email: string
    firstName?: string
    lastName?: string
    tenantId: string
    role: string
    sub: string
    name?: string
}

export const federatedAuthService = {
    async exchangeToken({ externalToken }: ExchangeTokenParams): Promise<{ token: string }> {
        // 1. Verification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const publicKey = system.get('ZENNTR_PUBLIC_KEY' as any)
        if (!publicKey) {
            throw new ActivepiecesError({
                code: ErrorCode.SYSTEM_PROP_INVALID,
                params: {
                    prop: 'ZENNTR_PUBLIC_KEY',
                },
            }, 'ZENNTR_PUBLIC_KEY is not defined')
        }

        let payload: ExternalTokenPayload
        try {
            payload = jwt.verify(externalToken, publicKey, { algorithms: ['RS256'] }) as ExternalTokenPayload
        }
        catch (e) {
            throw new ActivepiecesError({
                code: ErrorCode.INVALID_BEARER_TOKEN,
                params: {
                    message: 'Invalid external token signature',
                },
            })
        }

        const { email, tenantId, role } = payload
        const nameParts = (payload.name ?? payload.firstName + ' ' + payload.lastName).split(' ')
        const firstName = payload.firstName ?? nameParts[0]
        const lastName = payload.lastName ?? nameParts.slice(1).join(' ')

        // 2. User Provisioning (Upsert)
        let identity = await userIdentityService(system.globalLogger()).getIdentityByEmail(email)
        if (!identity) {
            identity = await userIdentityService(system.globalLogger()).create({
                email,
                firstName: firstName || 'User',
                lastName: lastName || '',
                password: uuidv4(), // Random password
                verified: true,
                trackEvents: true,
                newsLetter: false,
                provider: UserIdentityProvider.EMAIL,
            })
        }

        // Get or Create User
        // We need a platform ID. For now, we try to find the oldest platform as a fallback if the user isn't associated yet.
        // If the user already exists, we use their platformId.
        let user = await userService.getOneByIdentityIdOnly({ identityId: identity.id })
        
        let platformId = user?.platformId

        if (!platformId) {
            const defaultPlatform = await platformService.getOldestPlatform()
            if (!defaultPlatform) {
                throw new Error('No platform found to provision user')
            }
            platformId = defaultPlatform.id
        }

        if (!user) {
            user = await userService.create({
                identityId: identity.id,
                platformId,
                platformRole: PlatformRole.MEMBER,
                externalId: payload.sub, 
                // Note: user.externalId is usually for identifying the user in an external system. 
                // Here we might want to map it to something else if needed, but identityId is safe.
            })
        }

        // 3. Project Provisioning (Upsert)
        // Find project by externalId === tenantId
        let project = await projectService.getByPlatformIdAndExternalId({
            platformId,
            externalId: tenantId,
        })

        if (!project) {
            project = await projectService.create({
                displayName: 'Zenntr Project', // Or derive from tenant name if available in payload
                ownerId: user.id,
                platformId,
                type: ProjectType.TEAM, // Assuming Enterprise feature implies Team/Shared project
                externalId: tenantId,
            })
        }

        // Ensure User is Member
        if (project.ownerId !== user.id) {
            // Check if member exists
            const existingMember = await projectMemberService(system.globalLogger()).getRole({
                projectId: project.id,
                userId: user.id,
            })
            
            if (!existingMember) {
                await projectMemberService(system.globalLogger()).upsert({
                    projectId: project.id,
                    userId: user.id,
                    projectRoleName: DefaultProjectRole.EDITOR, // Default role, specific RBAC handled by zenntrRole
                })
            }
        }

        // 4. Token Issuance
        const token = await jwtUtils.sign({
            payload: {
                id: user.id,
                type: PrincipalType.USER,
                projectId: project.id,
                platformId: project.platformId,
                zenntrRole: role, // CRITICAL: Inject zenntrRole
            },
            key: await jwtUtils.getJwtSecret(),
            algorithm: JwtSignAlgorithm.HS256,
        })

        return { token }
    },
}

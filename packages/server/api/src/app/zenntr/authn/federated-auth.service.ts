import {
    ActivepiecesError,
    assertNotNullOrUndefined,
    DefaultProjectRole,
    ErrorCode,
    PlatformRole,
    Project,
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
import { projectRepo, projectService } from '../../project/project-service'
import { userService } from '../../user/user-service'

type ExchangeTokenParams = {
    externalToken: string
}

type ExternalTokenPayload = {
    email: string
    firstName?: string
    lastName?: string
    tenantId: string
    tenantName: string
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

        // Sanitize key: replace literal \n with actual newlines
        let sanitizedKey = publicKey.replace(/\\n/g, '\n')

        // Heuristic: If missing standard headers, wrap it (assuming raw base64 was pasted)
        if (!sanitizedKey.includes('-----BEGIN PUBLIC KEY-----')) {
            sanitizedKey = `-----BEGIN PUBLIC KEY-----\n${sanitizedKey.trim()}\n-----END PUBLIC KEY-----`
        }

        let payload: ExternalTokenPayload
        try {
            payload = jwt.verify(externalToken, sanitizedKey, { algorithms: ['RS256'] }) as ExternalTokenPayload
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e)
            system.globalLogger().error(e, `[FederatedAuth] Token verification failed. Error: ${errorMessage}`)
            throw new ActivepiecesError({
                code: ErrorCode.INVALID_BEARER_TOKEN,
                params: {
                    message: 'Invalid external token signature',
                },
            })
        }

        const { email, tenantId, tenantName, role } = payload
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

        // 2. Platform & Project Provisioning
        // Lookup Project by External ID (Tenant ID) to find the Platform
        let project: Project | null = await projectRepo().findOneBy({
            externalId: tenantId,
        })

        let platformId = project?.platformId
        let user: any = null

        if (platformId) {
             // Platform exists, ensure user is part of it
            user = await userService.getOneByIdentityAndPlatform({
                identityId: identity.id,
                platformId,
            })
        }
        else {
             // New Tenant -> New Platform -> New User -> New Project
            const defaultPlatformName = tenantName || 'Default Tenant'
            
            // Create New Admin User (PlatformId is required, but we need User ID for Platform Owner... Cycle break: create user with null platformId first)
             user = await userService.create({
                identityId: identity.id,
                platformId: null, 
                platformRole: PlatformRole.ADMIN,
                externalId: payload.sub,
            })

            const newPlatform = await platformService.create({
                ownerId: user.id,
                name: defaultPlatformName,
            })
            
            platformId = newPlatform.id
            
            // Link User to Platform
            await userService.update({
                id: user.id,
                platformId,
                platformRole: PlatformRole.ADMIN,
            })
            user.platformId = platformId

            // Create Default Project for this Tenant
            project = await projectService.create({
                displayName: defaultPlatformName, 
                ownerId: user.id,
                platformId,
                type: ProjectType.TEAM,
                externalId: tenantId,
            })
        }
        
        assertNotNullOrUndefined(project, 'project')

        if (!user) {
             // User doesn't exist in the existing platform, add them.
            user = await userService.create({
                identityId: identity.id,
                platformId: platformId!,
                platformRole: PlatformRole.MEMBER,
                externalId: payload.sub,
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

import { SystemProp } from '@activepieces/server-shared'
import {
    ActivepiecesError,
    assertNotNullOrUndefined,
    AuthenticationResponse,
    DefaultProjectRole,
    ErrorCode,
    PlatformRole,
    PrincipalType,
    Project,
    ProjectType,
    User,
    UserIdentityProvider,
} from '@activepieces/shared'
import * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { userIdentityService } from '../../authentication/user-identity/user-identity-service'
import { repoFactory } from '../../core/db/repo-factory'
import { jwtUtils } from '../../helper/jwt-utils'
import { system } from '../../helper/system/system'
import { platformService } from '../../platform/platform.service'
import { projectRepo, projectService } from '../../project/project-service'
import { userService } from '../../user/user-service'
import { ZenntrProjectMember, ZenntrProjectMemberEntity } from '../project-members/project-member.entity'
import { ZenntrProjectPlanEntity } from '../projects/project-plan.entity'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const zenntrProjectPlanRepo = repoFactory(ZenntrProjectPlanEntity)
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const zenntrProjectMemberRepo = repoFactory(ZenntrProjectMemberEntity)

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
    piecesFilterType?: string
    piecesTags?: string
    tasks?: string
    aiCredits?: string
}

export const federatedAuthService = {
    async exchangeToken({ externalToken }: ExchangeTokenParams): Promise<AuthenticationResponse> {
        // 1. Verification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const publicKey = system.get('ZENNTR_PUBLIC_KEY' as SystemProp)
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
                    message: `Invalid external token signature: ${errorMessage}`,
                },
            })
        }

        const { email, tenantId, tenantName, role, piecesFilterType, piecesTags, tasks, aiCredits } = payload
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

        // 3. Platform & Project Provisioning
        // Lookup Project by External ID (Tenant ID) to find the Platform
        let project: Project | null = await projectRepo().findOneBy({
            externalId: tenantId,
        })

        let platformId = project?.platformId
        let user: User | null = null

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
            assertNotNullOrUndefined(platformId, 'platformId')
            user = await userService.create({
                identityId: identity.id,
                platformId,
                platformRole: PlatformRole.MEMBER,
                externalId: payload.sub,
            })
        }

        // Ensure User is Member with correct Role
        const projectRole = role === 'ADMIN' ? 'OWNER' : (role === 'EDITOR' ? DefaultProjectRole.EDITOR : DefaultProjectRole.VIEWER) 
        // Note: Community 'ProjectMember' usually handles roles. We map 'role' claim.

        if (project.ownerId !== user.id) {
            const existingMember = await zenntrProjectMemberRepo().findOne({
                where: {
                    projectId: project.id,
                    userId: user.id,
                },
            })
            
            if (!existingMember) {
                await zenntrProjectMemberRepo().upsert({
                    projectId: project.id,
                    userId: user.id,
                    role: projectRole as ZenntrProjectMember['role'],
                    status: 'ACTIVE',
                    updated: new Date().toISOString(),
                }, ['projectId', 'userId'])
            }
        }

        // 4. Update Project Metadata/Plan based on Claims
        const pieces = piecesTags ? piecesTags.split(',').map(p => p.trim()).filter(p => p.length > 0) : []
        const planUpdate = {
            piecesFilterType: piecesFilterType || 'NONE',
            pieces,
            tasks: tasks ? parseInt(tasks) : undefined,
            aiCredits: aiCredits ? parseInt(aiCredits) : undefined,
        }

        // Update Zenntr Project Plan
        await zenntrProjectPlanRepo().upsert({
            projectId: project.id,
            name: project.displayName,
            piecesFilterType: planUpdate.piecesFilterType,
            pieces: JSON.stringify(planUpdate.pieces),
            tasks: planUpdate.tasks,
            aiCredits: planUpdate.aiCredits,
            updated: new Date().toISOString(),
        }, ['projectId'])

        // Update Project Metadata for Frontend Consumption
        if (!project.metadata || JSON.stringify(project.metadata.zenntrPlan) !== JSON.stringify(planUpdate)) {
            await projectService.update(project.id, {
                type: project.type,
                metadata: {
                    ...project.metadata,
                    zenntrPlan: planUpdate,
                },
            })
        }

        // 5. Token Issuance
        const tokenToken = await jwtUtils.sign({
            payload: {
                id: user.id,
                type: PrincipalType.USER,
                projectId: project.id,
                platform: {
                    id: platformId as string,
                },
                tokenVersion: identity.tokenVersion,
            },
            key: await jwtUtils.getJwtSecret(),
        })

        return {
            ...user,
            token: tokenToken,
            projectId: project.id,
            firstName: identity.firstName,
            lastName: identity.lastName,
            email: identity.email,
            trackEvents: identity.trackEvents,
            newsLetter: identity.newsLetter,
            verified: identity.verified,
        }
    },
}



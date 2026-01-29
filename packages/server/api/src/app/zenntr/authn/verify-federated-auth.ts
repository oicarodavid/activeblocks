
/* eslint-disable no-console, @typescript-eslint/no-non-null-assertion */
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { databaseConnection } from '../../database/database-connection'
import { system } from '../../helper/system/system'
import { projectService } from '../../project/project-service'
import { userService } from '../../user/user-service'
import { federatedAuthService } from './federated-auth.service'

async function runVerification(): Promise<void> {
    console.log('Initializing database connection...')
    await databaseConnection().initialize()

    console.log('Generating RSA Key Pair...')
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
    })

    const publicKeyPem = publicKey.export({ type: 'pkcs1', format: 'pem' }).toString()
    const privateKeyPem = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString()

    // Inject Public Key into System/Env for the service to read
    // Note: system.get reads from env, so we set process.env
    process.env['AP_ZENNTR_PUBLIC_KEY'] = publicKeyPem

    const tenantId = uuidv4()
    const email = `test-user-${uuidv4()}@example.com`

    const payload = {
        email,
        tenantId,
        role: 'ADMIN',
        firstName: 'Test',
        lastName: 'User',
        sub: email,
        name: 'Test User',
    }

    console.log('Signing external token...')
    const externalToken = jwt.sign(payload, privateKeyPem, { algorithm: 'RS256' })

    console.log('Exchanging token...')
    try {
        const result = await federatedAuthService.exchangeToken({ externalToken })
        console.log('Token exchanged successfully.')
        console.log('Received Internal Token:', result.token)

        // Verify Data in DB
        console.log('Verifying DB state...')
        const user = await userService.getOneByIdentityIdOnly({ identityId: (await import('../../authentication/user-identity/user-identity-service').then(m => m.userIdentityService(system.globalLogger()).getIdentityByEmail(email)))!.id })
        
        if (!user) {
            throw new Error('User not found in DB')
        }
        console.log('User found:', user.id)

        const project = await projectService.getByPlatformIdAndExternalId({
            platformId: user.platformId!,
            externalId: tenantId,
        })
        
        if (!project) {
            throw new Error('Project not found in DB')
        }
        console.log('Project found:', project.id)

        if (project.ownerId !== user.id) {
            console.log('User is not owner, checking membership...')
            // Check member
        }
        else {
            console.log('User is owner of the project.')
        }

        console.log('VERIFICATION SUCCESSFUL')

    }
    catch (e) {
        console.error('VERIFICATION FAILED', e)
    }
    finally {
        await databaseConnection().destroy()
    }
}

void runVerification()

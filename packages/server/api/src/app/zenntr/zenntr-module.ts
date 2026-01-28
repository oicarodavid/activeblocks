import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { zenntrPlatformService } from './platform/platform-service'
import { zenntrAuthnService } from './authn/authn-service'

import { zenntrProjectService } from './projects/project-service'
import { zenntrBillingService } from './billing/billing-service'

import { zenntrAuditLogService } from './audit-logs/audit-logs.service'
import { zenntrApiKeyService } from './api-keys/api-key.service'
import { zenntrCustomDomainService } from './custom-domains/custom-domain.service'

import { zenntrGitRepoService } from './git-repo/git-repo.service'
import { zenntrSigningKeyService } from './signing-key/signing-key.service'
import { zenntrLicenseKeyService } from './license-keys/license-key.service'
import { zenntrManagedAuthnService } from './managed-authn/managed-authn.service'
import { zenntrOAuthAppService } from './oauth-apps/oauth-app.service'
import { zenntrAlertsService } from './alerts/alerts.service'
import { zenntrFlagsService } from './flags/flags.service'
import { zenntrPiecesService } from './pieces/pieces.service'
import { zenntrPlatformWebhooksService } from './platform-webhooks/platform-webhooks.service'
import { zenntrTemplateService } from './template/template.service'

import { zenntrOtpService } from './otp/otp.service'

export const zenntrModule: FastifyPluginAsyncTypebox = async (app) => {
    app.log.info('Zenntr Module Loaded')
    await zenntrPlatformService.setup(app)
    await zenntrAuthnService.setup(app)
    await zenntrProjectService.setup(app)
    await zenntrBillingService.setup(app)
    await zenntrAuditLogService.setup(app)
    await zenntrApiKeyService.setup(app)
    await zenntrCustomDomainService.setup(app)
    await zenntrGitRepoService.setup(app)
    await zenntrSigningKeyService.setup(app)
    await zenntrLicenseKeyService.setup(app)
    await zenntrManagedAuthnService.setup(app)
    await zenntrOAuthAppService.setup(app)
    await zenntrAlertsService.setup(app)
    await zenntrFlagsService.setup(app)
    await zenntrPiecesService.setup(app)
    await zenntrPlatformWebhooksService.setup(app)
    await zenntrTemplateService.setup(app)
    await zenntrOtpService.setup(app)
}








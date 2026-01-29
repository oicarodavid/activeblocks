import { MigrationInterface, QueryRunner } from "typeorm";

export class ZenntrEntities1769654466859 implements MigrationInterface {
    name = 'ZenntrEntities1769654466859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "zenntr_managed_authn" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "domain" character varying NOT NULL,
                "provider" character varying NOT NULL,
                "config" jsonb NOT NULL,
                CONSTRAINT "PK_bd074281c3e0a5089ea69e85e3b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_oauth_app" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "displayName" character varying NOT NULL,
                "clientId" character varying NOT NULL,
                "clientSecret" character varying NOT NULL,
                "redirectUris" jsonb NOT NULL,
                CONSTRAINT "UQ_dad1f1bed5f5b5928d8043a82f3" UNIQUE ("clientId"),
                CONSTRAINT "PK_9f2ee0d9f76df58a5f5623f01c3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_alert" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "projectId" character varying(21) NOT NULL,
                "severity" character varying NOT NULL,
                "message" character varying NOT NULL,
                "readAt" TIMESTAMP,
                "data" jsonb,
                CONSTRAINT "PK_82583d7ddb1caa1eb12b09455c5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_platform_webhook" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "platformId" character varying(21) NOT NULL,
                "url" character varying NOT NULL,
                "events" jsonb NOT NULL,
                "secret" character varying NOT NULL,
                "enabled" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_b16bd7f7dcf6f8117dc989cc6f7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_template" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "description" character varying,
                "type" character varying NOT NULL,
                "projectId" character varying(21),
                "platformId" character varying(21),
                "flow" jsonb NOT NULL,
                "tags" jsonb NOT NULL,
                CONSTRAINT "PK_7e7f1f2aee042a47825edfb58e0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_audit_event" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "projectId" character varying(21) NOT NULL,
                "userId" character varying(21) NOT NULL,
                "action" character varying NOT NULL,
                "ipAddress" character varying NOT NULL,
                "userAgent" character varying NOT NULL,
                "details" jsonb,
                CONSTRAINT "PK_5d75ea39d0088549fc76764e8d0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_api_key" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "projectId" character varying(21) NOT NULL,
                "platformId" character varying(21),
                "displayName" character varying NOT NULL,
                "truncatedValue" character varying NOT NULL,
                "hashedValue" character varying NOT NULL,
                CONSTRAINT "PK_b561786bc9c3d9464f472eb938b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_custom_domain" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "domain" character varying NOT NULL,
                "projectId" character varying(21) NOT NULL,
                "status" character varying NOT NULL,
                "txtRecord" character varying,
                CONSTRAINT "UQ_199585ad399a6163ce8a09141e8" UNIQUE ("domain"),
                CONSTRAINT "PK_5c3bd63058bdce2c674c8ab9f11" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_git_repo" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "projectId" character varying(21) NOT NULL,
                "remoteUrl" character varying NOT NULL,
                "branch" character varying NOT NULL,
                "sshPrivateKey" character varying NOT NULL,
                "slug" character varying NOT NULL,
                CONSTRAINT "UQ_c422595557d5e89e8971c68c301" UNIQUE ("projectId"),
                CONSTRAINT "PK_e72f98b66fd4913c92943c36942" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_signing_key" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "platformId" character varying(21) NOT NULL,
                "publicKey" character varying NOT NULL,
                "algorithm" character varying NOT NULL,
                "generatedBy" character varying(21),
                CONSTRAINT "PK_b169b95c5105649c2212b00c0b0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_otp" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "userId" character varying(21) NOT NULL,
                "type" character varying NOT NULL,
                "value" character varying NOT NULL,
                "state" character varying NOT NULL DEFAULT 'PENDING',
                CONSTRAINT "PK_b129beefa61ec79053f5333e6e0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_project_plan" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "projectId" character varying(21) NOT NULL,
                "name" character varying NOT NULL,
                "flowRuns" integer NOT NULL,
                "activeFlows" integer NOT NULL,
                "connections" integer NOT NULL,
                "teamMembers" integer NOT NULL,
                CONSTRAINT "UQ_bfa2b9c0b35a013f43e46a9e948" UNIQUE ("projectId"),
                CONSTRAINT "PK_958dd4e7abfc81bb91f871f79c9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_project_release" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "projectId" character varying(21) NOT NULL,
                "type" character varying NOT NULL,
                "gitCommitId" character varying NOT NULL,
                "report" jsonb NOT NULL,
                CONSTRAINT "PK_00ab95e16352c286b4109897d82" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_platform_analytics_report" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "platformId" character varying(21) NOT NULL,
                "data" jsonb NOT NULL,
                CONSTRAINT "PK_d570a1e559a7f9594871d64b13b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_app_credential" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "appName" character varying NOT NULL,
                "settings" jsonb NOT NULL,
                CONSTRAINT "PK_6400e1cad572685cd17233df58d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zenntr_platform_config" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "key" character varying NOT NULL,
                "value" jsonb,
                CONSTRAINT "PK_f34ee1a7f47111e31a3af993efe" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_cell_record_id" ON "cell" ("recordId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."idx_cell_record_id"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_platform_config"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_app_credential"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_platform_analytics_report"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_project_release"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_project_plan"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_otp"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_signing_key"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_git_repo"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_custom_domain"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_api_key"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_audit_event"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_template"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_platform_webhook"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_alert"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_oauth_app"
        `);
        await queryRunner.query(`
            DROP TABLE "zenntr_managed_authn"
        `);
    }

}

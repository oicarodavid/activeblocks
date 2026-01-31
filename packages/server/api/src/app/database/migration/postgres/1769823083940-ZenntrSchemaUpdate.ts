import { MigrationInterface, QueryRunner } from "typeorm";

export class ZenntrSchemaUpdate1769823083940 implements MigrationInterface {
    name = 'ZenntrSchemaUpdate1769823083940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "zenntr_project_plan"
            ADD "piecesFilterType" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "zenntr_project_plan"
            ADD "pieces" jsonb
        `);
        await queryRunner.query(`
            ALTER TABLE "zenntr_project_plan"
            ADD "tasks" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "zenntr_project_plan"
            ADD "aiCredits" integer
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "zenntr_project_plan" DROP COLUMN "aiCredits"
        `);
        await queryRunner.query(`
            ALTER TABLE "zenntr_project_plan" DROP COLUMN "tasks"
        `);
        await queryRunner.query(`
            ALTER TABLE "zenntr_project_plan" DROP COLUMN "pieces"
        `);
        await queryRunner.query(`
            ALTER TABLE "zenntr_project_plan" DROP COLUMN "piecesFilterType"
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectStatus1727807242183 implements MigrationInterface {
    name = 'AddProjectStatus1727807242183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "status" character varying NOT NULL DEFAULT 'To Do'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "status"`);
    }

}

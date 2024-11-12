import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteProject1731370794874 implements MigrationInterface {
    name = 'AddCascadeDeleteProject1731370794874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "FK_f91cf97e77a2abd7df67ca1748f"`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "FK_f91cf97e77a2abd7df67ca1748f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "FK_f91cf97e77a2abd7df67ca1748f"`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "FK_f91cf97e77a2abd7df67ca1748f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

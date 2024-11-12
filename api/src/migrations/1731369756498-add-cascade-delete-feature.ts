import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteFeature1731369756498 implements MigrationInterface {
    name = 'AddCascadeDeleteFeature1731369756498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_story" DROP CONSTRAINT "FK_65784c20d2a4562774fa196596c"`);
        await queryRunner.query(`ALTER TABLE "user_story" ADD CONSTRAINT "FK_65784c20d2a4562774fa196596c" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_story" DROP CONSTRAINT "FK_65784c20d2a4562774fa196596c"`);
        await queryRunner.query(`ALTER TABLE "user_story" ADD CONSTRAINT "FK_65784c20d2a4562774fa196596c" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

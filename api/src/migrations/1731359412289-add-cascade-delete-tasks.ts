import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteTasks1731359412289 implements MigrationInterface {
    name = 'AddCascadeDeleteTasks1731359412289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_b1500fa73277080dc0d730f2316"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_b1500fa73277080dc0d730f2316" FOREIGN KEY ("userStoryId") REFERENCES "user_story"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_b1500fa73277080dc0d730f2316"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_b1500fa73277080dc0d730f2316" FOREIGN KEY ("userStoryId") REFERENCES "user_story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

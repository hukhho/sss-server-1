import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserToDeposit1697447023487 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" ADD "user_id" character varying`);
        await queryRunner.query(`CREATE INDEX "DepositUserId" ON "deposit" ("user_id") `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."DepositUserId"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "user_id"`);
    }

}

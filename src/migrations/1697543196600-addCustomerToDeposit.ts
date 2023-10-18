import { MigrationInterface, QueryRunner } from "typeorm"

export class AddCustomerToDeposit1697543196600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" ADD "customer_id" character varying`);
        await queryRunner.query(`CREATE INDEX "DepositCustomerId" ON "deposit" ("customer_id") `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."DepositCustomerId"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "customer_id"`);
    }
}

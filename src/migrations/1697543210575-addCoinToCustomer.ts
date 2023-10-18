import { MigrationInterface, QueryRunner } from "typeorm"

export class AddCoinToCustomer1697543210575 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "coin" numeric(20, 2) DEFAULT 0`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("customer", "coin");
    }
}

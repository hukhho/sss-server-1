import { MigrationInterface, QueryRunner } from "typeorm"

export class AddIsSellerToDeposit1697544315424 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" ADD "is_seller" boolean`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "is_seller"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm"

export class ProductChanged1695981359968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "seller_id" character varying`);
        await queryRunner.query(`CREATE INDEX "ProductSellerId" ON "product" ("seller_id") `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."ProductSellerId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "seller_id"`);
    }

}

    import { MigrationInterface, QueryRunner } from "typeorm"

    export class AddCoinToUser1697448026572 implements MigrationInterface {

        public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`ALTER TABLE "user" ADD "coin" numeric(20, 2) DEFAULT 0`);
        }

        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropColumn("user", "coin");
        }

    }

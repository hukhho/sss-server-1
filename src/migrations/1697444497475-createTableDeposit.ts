import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableDeposit1697444497475 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "deposit" (
                "id" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "coin_amount" numeric(20, 2) DEFAULT 0,
                "fiat_type" character varying(10) NULL,
                "fiat_amount" numeric(20, 2) DEFAULT 0,
                "method" character varying(255),
                "status" character varying(255),
                "note" text,
                "txn" text,
                "typeTrans" text,
                "revicedName" text,
                "revicedBankName" text,
                "revicedBankNumber" text,
                CONSTRAINT "PK_deposits" PRIMARY KEY ("id")
            );
        `);
      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "deposit"`);
    }
}

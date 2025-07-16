import { MigrationInterface, QueryRunner } from "typeorm";

export class CriarTabelaToken1752554896139 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying(500) NOT NULL,
        "is_revoked" boolean NOT NULL DEFAULT false,
        "expires_at" TIMESTAMP NOT NULL,
        "usuario_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tokens_usuario" FOREIGN KEY ("usuario_id") 
        REFERENCES "usuarios"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
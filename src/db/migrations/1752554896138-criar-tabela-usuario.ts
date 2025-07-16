import { MigrationInterface, QueryRunner } from "typeorm";

export class CriarTabelaUsuario1752554896138 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuarios" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "nome" character varying(100) NOT NULL, 
        "username" character varying(15) NOT NULL, 
        "email" character varying(70) NOT NULL, 
        "senha" character varying(255) NOT NULL, 
        "telefone" character varying(12) NOT NULL,
        "data_de_nascimento" DATE NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "deleted_at" TIMESTAMP, 
        CONSTRAINT "PK_usuarios_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_usuarios_username" UNIQUE ("username"),
        CONSTRAINT "UQ_usuarios_email" UNIQUE ("email")
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuarios"`);
  }
}
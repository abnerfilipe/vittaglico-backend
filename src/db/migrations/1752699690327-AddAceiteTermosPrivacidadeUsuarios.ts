import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAceiteTermosPrivacidadeUsuarios1752699690327 implements MigrationInterface {
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuarios
      ADD COLUMN aceite_termos_condicoes BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN aceite_politica_de_privacidade BOOLEAN NOT NULL DEFAULT true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuarios
      DROP COLUMN aceite_termos_condicoes,
      DROP COLUMN aceite_politica_de_privacidade
    `);
  }
}

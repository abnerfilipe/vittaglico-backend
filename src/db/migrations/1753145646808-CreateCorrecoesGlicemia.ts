import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCorrecoesGlicemia1753145646808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE correcoes_glicemia (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuarioId uuid NOT NULL,
        glicoseAtual float NOT NULL,
        glicoseAlvo float NOT NULL,
        fatorSensibilidadeInsulina float NOT NULL,
        insulinaAtiva float NOT NULL,
        bolus float NOT NULL,
        message text,
        createdAt timestamp with time zone DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE correcoes_glicemia;
    `);
  }
}

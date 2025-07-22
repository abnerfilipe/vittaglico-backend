import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCorrecoesGlicemia1753145646808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE correcoes_glicemia (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuario_id uuid NOT NULL,
        glicemia_id uuid,
        glicose_atual float NOT NULL,
        glicose_alvo float NOT NULL,
        fator_sensibilidade_insulina float NOT NULL,
        insulina_ativa float NOT NULL,
        bolus float NOT NULL,
        message text,
        created_at timestamp with time zone DEFAULT now(),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (glicemia_id) REFERENCES glicemias(id) ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE correcoes_glicemia;
    `);
  }
}
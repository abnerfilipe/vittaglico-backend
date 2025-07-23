import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAplicacoesInsulinaTable1753224446010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          ALTER TABLE aplicacoes_insulina
          ALTER COLUMN data_hora_aplicacao TYPE varchar(20);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          ALTER TABLE aplicacoes_insulina
          ALTER COLUMN data_hora_aplicacao TYPE timestamp with time zone
          USING data_hora_aplicacao::timestamp with time zone;
      `);
  }
}

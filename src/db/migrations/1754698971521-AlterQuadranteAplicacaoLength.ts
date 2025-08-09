import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterQuadranteAplicacaoLength1754698971521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE aplicacoes_insulina
      ALTER COLUMN quadrante_aplicacao TYPE varchar(50);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE aplicacoes_insulina
      ALTER COLUMN quadrante_aplicacao TYPE varchar(20);
    `);
  }
}

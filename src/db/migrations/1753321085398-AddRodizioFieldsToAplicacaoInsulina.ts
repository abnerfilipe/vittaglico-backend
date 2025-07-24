import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRodizioFieldsToAplicacaoInsulina1753321085398 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_local_aplicacao_enum" AS ENUM('abdome', 'braco', 'coxa', 'nadega')`);
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_lado_aplicacao_enum" AS ENUM('direito', 'esquerdo')`);
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_quadrante_aplicacao_enum" AS ENUM('superior-direito', 'superior-esquerdo', 'inferior-direito', 'inferior-esquerdo', 'central')`);

    
    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'local_aplicacao',
        type: 'enum', 
        enum: ['abdome', 'braco', 'coxa', 'nadega'], 
        isNullable: false, 
      }),
    );

    
    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'lado_aplicacao',
        type: 'enum', 
        enum: ['direito', 'esquerdo'], 
        isNullable: false, 
      }),
    );

    
    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'quadrante_aplicacao',
        type: 'enum', 
        enum: ['superior-direito', 'superior-esquerdo', 'inferior-direito', 'inferior-esquerdo', 'central'], 
        isNullable: true, 
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.dropColumn('aplicacoes_insulina', 'quadrante_aplicacao');
    await queryRunner.dropColumn('aplicacoes_insulina', 'lado_aplicacao');
    await queryRunner.dropColumn('aplicacoes_insulina', 'local_aplicacao');

    
    await queryRunner.query(`DROP TYPE "public"."aplicacoes_insulina_quadrante_aplicacao_enum"`);
    await queryRunner.query(`DROP TYPE "public"."aplicacoes_insulina_lado_aplicacao_enum"`);
    await queryRunner.query(`DROP TYPE "public"."aplicacoes_insulina_local_aplicacao_enum"`);
  }}

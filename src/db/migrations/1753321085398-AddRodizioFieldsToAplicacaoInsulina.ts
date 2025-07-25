import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRodizioFieldsToAplicacaoInsulina1753321085398 implements MigrationInterface {


  public async up(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_local_aplicacao_enum" AS ENUM('Abdome', 'Braço', 'Coxa', 'Nádega')`);
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_lado_aplicacao_enum" AS ENUM('Direito', 'Esquerdo')`);
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_quadrante_aplicacao_enum" AS ENUM('Superior Direito', 'Superior Esquerdo', 'Inferior Direito', 'Inferior Esquerdo', 'Central', 'Área Total', 'Nenhum')`);

    
    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'local_aplicacao',
        type: 'enum',
        enum: ['Abdome', 'Braço', 'Coxa', 'Nádega'],
        isNullable: true, 
      }),
    );

    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'lado_aplicacao',
        type: 'enum',
        enum: ['Direito', 'Esquerdo'],
        isNullable: true, 
      }),
    );

    
    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'quadrante_aplicacao',
        type: 'enum',
        enum: ['Superior Direito', 'Superior Esquerdo', 'Inferior Direito', 'Inferior Esquerdo', 'Central', 'Área Total', 'Nenhum'],
        isNullable: true, 
      }),
    );

    
    await queryRunner.query(`UPDATE "aplicacoes_insulina" SET "local_aplicacao" = 'Abdome', "lado_aplicacao" = 'Direito' WHERE "local_aplicacao" IS NULL OR "lado_aplicacao" IS NULL`);

    
    await queryRunner.query(`ALTER TABLE "aplicacoes_insulina" ALTER COLUMN "local_aplicacao" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "aplicacoes_insulina" ALTER COLUMN "lado_aplicacao" SET NOT NULL`);

    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      
      await queryRunner.query(`ALTER TABLE "aplicacoes_insulina" ALTER COLUMN "local_aplicacao" DROP NOT NULL`);
      await queryRunner.query(`ALTER TABLE "aplicacoes_insulina" ALTER COLUMN "lado_aplicacao" DROP NOT NULL`);

      
      await queryRunner.dropColumn('aplicacoes_insulina', 'quadrante_aplicacao');
      await queryRunner.dropColumn('aplicacoes_insulina', 'lado_aplicacao');
      await queryRunner.dropColumn('aplicacoes_insulina', 'local_aplicacao');

      
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."aplicacoes_insulina_quadrante_aplicacao_enum"`);
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."aplicacoes_insulina_lado_aplicacao_enum"`);
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."aplicacoes_insulina_local_aplicacao_enum"`);
    } catch (error) {
      console.error('Erro ao reverter migration:', error);
      throw error;
    }
  }
}
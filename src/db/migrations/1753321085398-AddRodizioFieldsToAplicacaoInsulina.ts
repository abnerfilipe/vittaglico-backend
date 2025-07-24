import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRodizioFieldsToAplicacaoInsulina1753321085398 implements MigrationInterface {


  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Criar os tipos ENUM no PostgreSQL com os valores corretos dos enums
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_local_aplicacao_enum" AS ENUM('Abdome', 'Braço', 'Coxa', 'Nádega')`);
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_lado_aplicacao_enum" AS ENUM('Direito', 'Esquerdo')`);
    await queryRunner.query(`CREATE TYPE "public"."aplicacoes_insulina_quadrante_aplicacao_enum" AS ENUM('Superior Direito', 'Superior Esquerdo', 'Inferior Direito', 'Inferior Esquerdo', 'Central', 'Área Total', 'Nenhum')`);

    // 2. Adicionar as novas colunas como NULLABLE (temporariamente)
    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'local_aplicacao',
        type: 'enum',
        enum: ['Abdome', 'Braço', 'Coxa', 'Nádega'],
        isNullable: true, // TEMPORARIAMENTE como NULLABLE
      }),
    );

    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'lado_aplicacao',
        type: 'enum',
        enum: ['Direito', 'Esquerdo'],
        isNullable: true, // TEMPORARIAMENTE como NULLABLE
      }),
    );

    // Quadrante já era nullable, então pode permanecer assim.
    await queryRunner.addColumn(
      'aplicacoes_insulina',
      new TableColumn({
        name: 'quadrante_aplicacao',
        type: 'enum',
        enum: ['Superior Direito', 'Superior Esquerdo', 'Inferior Direito', 'Inferior Esquerdo', 'Central', 'Área Total', 'Nenhum'],
        isNullable: true, // Permanece como NULLABLE
      }),
    );

    // 3. Atualizar os registros existentes com um valor padrão.
    await queryRunner.query(`UPDATE "aplicacoes_insulina" SET "local_aplicacao" = 'Abdome', "lado_aplicacao" = 'Direito' WHERE "local_aplicacao" IS NULL OR "lado_aplicacao" IS NULL`);

    // 4. Alterar as colunas para NOT NULL (Agora que todos os registros têm um valor)
    await queryRunner.query(`ALTER TABLE "aplicacoes_insulina" ALTER COLUMN "local_aplicacao" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "aplicacoes_insulina" ALTER COLUMN "lado_aplicacao" SET NOT NULL`);

    // Quadrante permanece nullable, então não precisa de ALTER TABLE SET NOT NULL.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // 1. Remover NOT NULL constraints
      await queryRunner.query(`ALTER TABLE "aplicacoes_insulina" ALTER COLUMN "local_aplicacao" DROP NOT NULL`);
      await queryRunner.query(`ALTER TABLE "aplicacoes_insulina" ALTER COLUMN "lado_aplicacao" DROP NOT NULL`);

      // 2. Remover colunas
      await queryRunner.dropColumn('aplicacoes_insulina', 'quadrante_aplicacao');
      await queryRunner.dropColumn('aplicacoes_insulina', 'lado_aplicacao');
      await queryRunner.dropColumn('aplicacoes_insulina', 'local_aplicacao');

      // 3. Remover tipos enum com verificação de existência
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."aplicacoes_insulina_quadrante_aplicacao_enum"`);
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."aplicacoes_insulina_lado_aplicacao_enum"`);
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."aplicacoes_insulina_local_aplicacao_enum"`);
    } catch (error) {
      console.error('Erro ao reverter migration:', error);
      throw error;
    }
  }
}
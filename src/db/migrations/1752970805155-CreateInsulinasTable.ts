import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInsulinasTable1752970805155 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."insulinas_tipo_basal_correcao_enum" AS ENUM('Correção', 'Basal')`);

        await queryRunner.createTable(
            new Table({
                name: 'insulinas',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'nome',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'tipo_basal_correcao',
                        type: 'enum',
                        enumName: 'insulinas_tipo_basal_correcao_enum',
                        default: `'Correção'`,
                        isNullable: false,
                    },
                    {
                        name: 'duracao_acao_horas',
                        type: 'float',
                        isNullable: false,
                    },
                    {
                        name: 'pico_acao_horas',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'usuario_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'insulinas',
            new TableForeignKey({
                columnNames: ['usuario_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'usuarios',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('insulinas');
        if (table) {
            const foreignKey = table.foreignKeys.find(
                fk => fk.columnNames.includes('usuario_id')
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey('insulinas', foreignKey);
            }
        }
        await queryRunner.query(`DROP TYPE "public"."insulinas_tipo_basal_correcao_enum"`);
        await queryRunner.dropTable('insulinas');
    }

}
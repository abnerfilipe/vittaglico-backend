import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAplicacoesInsulinaTable1678886500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'aplicacoes_insulina',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'quantidade_unidades',
                        type: 'float',
                        isNullable: false,
                    },
                    {
                        name: 'data_hora_aplicacao',
                        type: 'timestamp with time zone',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                    {
                        name: 'usuario_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'insulina_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'aplicacoes_insulina',
            new TableForeignKey({
                columnNames: ['usuario_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'usuarios',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'aplicacoes_insulina',
            new TableForeignKey({
                columnNames: ['insulina_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'insulinas',
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('aplicacoes_insulina', 'insulina_id');
        await queryRunner.dropForeignKey('aplicacoes_insulina', 'usuario_id');
        await queryRunner.dropTable('aplicacoes_insulina');
    }
}
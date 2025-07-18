import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateGlicemiasAndRelationToUsuarios1752796798429 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'glicemias',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'usuario_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'valor',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'medida',
                        type: 'varchar',
                        length: '10',
                        isNullable: false,
                        default: "'mg/dL'",
                    },
                    {
                        name: 'periodo',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'data_hora_de_registro',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
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
            'glicemias',
            new TableForeignKey({
                columnNames: ['usuario_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'usuarios',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('glicemias');
        if (table) {
            const foreignKey = table.foreignKeys.find(
                fk => fk.columnNames.includes('usuario_id')
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey('glicemias', foreignKey);
            }
        }
        await queryRunner.dropTable('glicemias');
    }
} 
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInsulinasTable1678886400000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
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
                        enum: ['Correção', 'Basal'],
                        default: "'Correção'",
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
            true,
        );

        await queryRunner.createForeignKey(
            'insulinas',
            new TableForeignKey({
                name: 'fk_insulina_usuario', 
                columnNames: ['usuario_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'usuarios',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query('DROP TABLE IF EXISTS insulinas CASCADE');
    }
}
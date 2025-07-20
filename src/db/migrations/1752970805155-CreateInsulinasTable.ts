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
                        name: 'tipo_basal_bolus',
                        type: 'enum',
                        enum: ['Bolus', 'Basal'],
                        default: "'Bolus'",
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
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'insulinas',
            new TableForeignKey({
                name: 'fk_insulina_usuario', // Nome explícito para a constraint
                columnNames: ['usuario_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'usuarios',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Em PostgreSQL, DROP TABLE CASCADE remove automaticamente todas as chaves estrangeiras
        await queryRunner.query('DROP TABLE IF EXISTS insulinas CASCADE');
    }
}
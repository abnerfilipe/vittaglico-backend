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
                    {
                        name: 'duracao_acao_insulina_efetiva',
                        type: 'float',
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

        
        const usuarioFk = new TableForeignKey({
            name: 'fk_aplicacao_usuario', 
            columnNames: ['usuario_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuarios',
            onDelete: 'CASCADE',
        });
        
        const insulinaFk = new TableForeignKey({
            name: 'fk_aplicacao_insulina', 
            columnNames: ['insulina_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'insulinas',
            onDelete: 'SET NULL',
        });

        await queryRunner.createForeignKey('aplicacoes_insulina', usuarioFk);
        await queryRunner.createForeignKey('aplicacoes_insulina', insulinaFk);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS aplicacoes_insulina CASCADE');
    }
}
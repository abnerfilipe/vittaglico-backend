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
                ],
            }),
            true,
        );

        // Criar chave estrangeira com nome explícito para usuario_id
        const usuarioFk = new TableForeignKey({
            name: 'fk_aplicacao_usuario', // Nome explícito para a constraint
            columnNames: ['usuario_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuarios',
            onDelete: 'CASCADE',
        });
        
        // Criar chave estrangeira com nome explícito para insulina_id
        const insulinaFk = new TableForeignKey({
            name: 'fk_aplicacao_insulina', // Nome explícito para a constraint
            columnNames: ['insulina_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'insulinas',
            onDelete: 'SET NULL',
        });

        // Adicionar as chaves estrangeiras
        await queryRunner.createForeignKey('aplicacoes_insulina', usuarioFk);
        await queryRunner.createForeignKey('aplicacoes_insulina', insulinaFk);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Em PostgreSQL, DROP TABLE CASCADE remove automaticamente todas as chaves estrangeiras
        await queryRunner.query('DROP TABLE IF EXISTS aplicacoes_insulina CASCADE');
    }
}
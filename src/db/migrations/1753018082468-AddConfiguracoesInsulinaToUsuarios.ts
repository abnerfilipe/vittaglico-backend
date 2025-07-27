import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddConfiguracoesInsulinaToUsuarios1753018082468 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'usuarios',
            new TableColumn({
                name: 'configuracoes_insulina',
                type: 'jsonb',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('usuarios', 'configuracoes_insulina');
    }
}
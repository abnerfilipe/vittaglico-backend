import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { Insulina } from './insulina.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('aplicacoes_insulina')
export class AplicacaoInsulina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float', { name: 'quantidade_unidades' })
  quantidadeUnidades: number;

  @Column({ name: 'data_hora_aplicacao', type: 'varchar', length: 20, nullable: false })
  dataHoraAplicacao: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.aplicacoesInsulina, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @ManyToOne(() => Insulina, (insulina) => insulina.aplicacoes, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'insulina_id' })
  insulinaAssociada: Insulina;

  @Column({ name: 'insulina_id', nullable: true })
  insulinaId: string | null;

  @Column('float', { name: 'duracao_acao_insulina_efetiva' })
  duracaoAcaoInsulinaEfetiva: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
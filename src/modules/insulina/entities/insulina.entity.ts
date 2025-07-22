import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { AplicacaoInsulina } from './aplicacao-insulina.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { TipoInsulinaEnum } from '../enum/tipoInsulina.enum';

@Entity('insulinas') 
export class Insulina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string; 
  
  @Column({
    type: 'enum',
    enum: TipoInsulinaEnum,
    name: 'tipo_basal_correcao',
    default: TipoInsulinaEnum.CORRECAO,
  })
  tipoBasalCorrecao: TipoInsulinaEnum;

  @Column('float', { name: 'duracao_acao_horas', nullable: false }) 
  
  duracaoAcaoHoras: number;

  @Column('float', { name: 'pico_acao_horas', nullable: true })
  
  picoAcaoHoras: number | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.insulinas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @OneToMany(() => AplicacaoInsulina, (aplicacao) => aplicacao.insulinaAssociada, { cascade: true })
  aplicacoes: AplicacaoInsulina[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

}
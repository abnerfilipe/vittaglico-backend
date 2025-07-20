import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AplicacaoInsulina } from './aplicacao-insulina.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { TipoInsulinaEnum } from '../enum/tipoInsulina.enum';

@Entity('insulinas') // Renomeado para 'insulinas'
export class Insulina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string; // Ex: 'Humalog', 'Novorapid', 'Lantus', 'Levemir'
  
  @Column({
    type: 'enum',
    enum: TipoInsulinaEnum,
    name: 'tipo_basal_bolus',
    default: TipoInsulinaEnum.BOLUS,
  })
  tipoBasalBolus: TipoInsulinaEnum;

  @Column('float', { name: 'duracao_acao_horas', nullable: false }) // Agora obrigatória e renomeada
  // Duração padrão da ação para este tipo específico de insulina (em horas).
  duracaoAcaoHoras: number;

  @Column('float', { name: 'pico_acao_horas', nullable: true })
  // Pico de ação para este tipo (em horas). Útil para gráficos ou cálculos avançados.
  picoAcaoHoras: number | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.insulinas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @OneToMany(() => AplicacaoInsulina, (aplicacao) => aplicacao.insulinaAssociada, { cascade: true })
  aplicacoes: AplicacaoInsulina[];

}
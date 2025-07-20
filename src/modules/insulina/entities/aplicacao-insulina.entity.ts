import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Insulina } from './insulina.entity'; // Importar a entidade Insulina renomeada
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('aplicacoes_insulina')
export class AplicacaoInsulina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float', { name: 'quantidade_unidades' })
  quantidadeUnidades: number;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', name: 'data_hora_aplicacao' })
  dataHoraAplicacao: Date;

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
}
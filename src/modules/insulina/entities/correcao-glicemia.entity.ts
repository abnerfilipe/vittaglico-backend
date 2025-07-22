import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Glicemia } from '../../glicemia/entities/glicemia.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('correcoes_glicemia')
export class CorrecaoGlicemia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'glicemia_id', type: 'uuid', nullable: true })
  glicemiaId: string | null;

  @ManyToOne(() => Glicemia, { nullable: true })
  @JoinColumn({ name: 'glicemia_id' })
  glicemia: Glicemia | null;

  @Column({ name: 'glicose_atual', type: 'float' })
  glicoseAtual: number;

  @Column({ name: 'glicose_alvo', type: 'float' })
  glicoseAlvo: number;

  @Column({ name: 'fator_sensibilidade_insulina', type: 'float' })
  fatorSensibilidadeInsulina: number;

  @Column({ name: 'insulina_ativa', type: 'float' })
  insulinaAtiva: number;

  @Column({ type: 'float' })
  bolus: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
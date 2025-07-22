import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('correcoes_glicemia')
export class CorrecaoGlicemia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  usuarioId: string;

  @Column({ type: 'float' })
  glicoseAtual: number;

  @Column({ type: 'float' })
  glicoseAlvo: number;

  @Column({ type: 'float' })
  fatorSensibilidadeInsulina: number;

  @Column({ type: 'float' })
  insulinaAtiva: number;

  @Column({ type: 'float' })
  bolus: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
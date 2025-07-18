import { UsuarioEntity } from '../../usuario/usuario.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PeriodoEnum } from '../enum/periodo.enum';

@Entity({ name: 'glicemias' })
export class GlicemiaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.glicemias, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @Column({ name: 'valor', nullable: false })
  valor: number;

  @Column({ name: 'medida', default: 'mg/dL', nullable: false })
  medida: string;

  @Column({ name: 'periodo', type: 'enum', enum: PeriodoEnum, nullable: true })
  periodo: PeriodoEnum;

  @Column({ name: 'data_hora_de_registro', type: Date, nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  dataHoraDeRegistro: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
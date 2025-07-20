import { Usuario } from '../../usuario/entities/usuario.entity';
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
export class Glicemia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.glicemias, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id', nullable: false })
  usuarioId: string;

  @Column({ name: 'valor', nullable: false })
  valor: number;

  @Column({ name: 'medida', default: 'mg/dL', nullable: false })
  medida: string;

  @Column({ name: 'periodo', type: 'enum', enum: PeriodoEnum, nullable: false })
  periodo: PeriodoEnum;

  @Column({ name: 'data_hora_de_registro', type: Date, nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  dataHoraDeRegistro: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  constructor(
    valor?: number,
    usuarioId?: string,
    dataHoraDeRegistro?: Date,
    periodo?: PeriodoEnum,
    medida?: string,
  ) {
    if (valor !== undefined) this.valor = valor;
    if (usuarioId !== undefined) this.usuarioId = usuarioId;
    if (dataHoraDeRegistro !== undefined) this.dataHoraDeRegistro = dataHoraDeRegistro.toISOString();
    if (medida !== undefined) this.medida = medida;
    else if (this.medida === undefined) this.medida = 'mg/dL';
    if (periodo !== undefined) this.periodo = periodo;
  }
}
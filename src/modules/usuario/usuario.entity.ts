import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'email', length: 70, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'senha', length: 255, nullable: false })
  senha: string;

  @Column({ name: 'telefone', length: 20, nullable: true })
  telefone: string;

  @Column({ name: 'data_de_nascimento',type: Date, nullable: true })
  dataDeNascimento: string;

  @Column({ name: 'aceite_termos_condicoes', type: 'boolean', nullable: false, default: true })
  aceiteTermosCondicoes: boolean;

  @Column({ name: 'aceite_politica_de_privacidade', type: 'boolean', nullable: false, default: true })
  aceitePoliticaDePrivacidade: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
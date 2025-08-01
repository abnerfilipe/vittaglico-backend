import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Glicemia } from '../../glicemia/entities/glicemia.entity';
import { AplicacaoInsulina } from '../../insulina/entities/aplicacao-insulina.entity';
import { Insulina } from '../../insulina/entities/insulina.entity';
import { ConfiguracoesInsulina } from './configuracoes-insulina';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'email', length: 70, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'senha', length: 255, nullable: false })
  senha: string;

  @Column({ name: 'telefone', length: 12, nullable: true })
  telefone: string;

  @Column({ name: 'data_de_nascimento', nullable: true })
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

  @OneToMany(() => Glicemia, (glicemia) => glicemia.usuario)
  glicemias: Glicemia[];

  @OneToMany(() => AplicacaoInsulina, (aplicacao) => aplicacao.usuario, { cascade: ['insert', 'update'] })
  aplicacoesInsulina: AplicacaoInsulina[];

  @OneToMany(() => Insulina, (insulina) => insulina.usuario, { cascade: ['insert', 'update'] })
  insulinas: Insulina[];

  @Column({ name: 'configuracoes_insulina', type: 'jsonb', nullable: true })
  configuracoesInsulina: ConfiguracoesInsulina | null;

}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'Nome de usuário cadastrado',
    example: 'usuario1',
    required: true
  })
  @IsNotEmpty({ message: 'O username não pode ser vazio' })
  @IsString({ message: 'O username deve ser uma string' })
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    required: true
  })
  @IsNotEmpty({ message: 'A senha não pode ser vazia' })
  @IsString({ message: 'A senha deve ser uma string' })
  password: string;
}
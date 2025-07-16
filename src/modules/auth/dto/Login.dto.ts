import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'Nome de usuário cadastrado',
    example: 'usuario1',
    required: true
  })
  @IsNotEmpty({ message: 'O email não pode ser vazio' })
  @IsString({ message: 'O email deve ser uma string' })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    required: true
  })
  @IsNotEmpty({ message: 'A senha não pode ser vazia' })
  @IsString({ message: 'A senha deve ser uma string' })
  password: string;
}
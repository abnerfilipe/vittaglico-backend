import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDTO {
  @ApiProperty({
    description: 'ID do usuário',
    example: 'uuid-do-usuario'
  })
  sub: string;

  @ApiProperty({
    description: 'Nome de usuário',
    example: 'usuario1'
  })
  username: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com'
  })
  email: string;
}
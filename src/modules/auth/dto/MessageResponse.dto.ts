import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDTO {
  @ApiProperty({
    description: 'Mensagem de resposta',
    example: 'Operação realizada com sucesso'
  })
  message: string;
}
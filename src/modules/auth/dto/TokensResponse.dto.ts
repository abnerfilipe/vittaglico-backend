import { ApiProperty } from '@nestjs/swagger';
import { ListaTokenDTO } from './ListaToken.dto';

export class TokensResponseDTO {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Tokens encontrados'
  })
  message: string;

  @ApiProperty({
    description: 'Lista de tokens ativos',
    type: [ListaTokenDTO]
  })
  tokens: ListaTokenDTO[];
}
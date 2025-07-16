import { ApiProperty } from '@nestjs/swagger';
import { ListaUsuarioDTO } from './ListaUsuario.dto';

export class RemoveUsuarioResponseDTO {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'usuário removido com sucesso'
  })
  messagem: string;

  @ApiProperty({
    description: 'Dados do usuário removido',
    type: ListaUsuarioDTO
  })
  usuario: ListaUsuarioDTO;
}
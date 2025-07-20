import { ApiProperty } from '@nestjs/swagger';
import { ListaUsuarioDTO } from './ListaUsuario.dto';

export class ListaUsuariosResponseDTO {
  @ApiProperty({ description: 'Mensagem de sucesso', example: 'Usuários obtidos com sucesso.' })
  mensagem: string;

  @ApiProperty({ description: 'Lista de usuários', type: [ListaUsuarioDTO] })
  usuarios: ListaUsuarioDTO[];
}
import { ApiProperty } from '@nestjs/swagger';
import { ListaUsuarioDTO } from './ListaUsuario.dto';

export class CriaUsuarioResponseDTO {
  @ApiProperty({ description: 'Mensagem de sucesso', example: 'usuário criado com sucesso' })
  messagem: string;

  @ApiProperty({ description: 'Dados do usuário criado', type: ListaUsuarioDTO })
  usuario: ListaUsuarioDTO;
}
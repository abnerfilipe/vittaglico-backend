import { ApiProperty } from '@nestjs/swagger';
import { ListaUsuarioDTO } from './ListaUsuario.dto';

export class AtualizaUsuarioResponseDTO {
  @ApiProperty({ description: 'Mensagem de sucesso', example: 'usuário atualizado com sucesso' })
  messagem: string;

  @ApiProperty({ description: 'Dados do usuário atualizado', type: ListaUsuarioDTO })
  usuario: ListaUsuarioDTO;
}
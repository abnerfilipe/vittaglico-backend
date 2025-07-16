import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Request
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ListaTokenDTO } from './dto/ListaToken.dto';
import { LoginDTO } from './dto/Login.dto'; // Você precisará criar este DTO
import { LoginResponseDTO } from './dto/LoginResponse.dto'; // Você precisará criar este DTO
import { MessageResponseDTO } from './dto/MessageResponse.dto';
import { ProfileResponseDTO } from './dto/ProfileResponse.dto'; // Você precisará criar este DTO
import { TokensResponseDTO } from './dto/TokensResponse.dto'; // Você precisará criar este DTO
import { ValidateTokenResponseDTO } from './dto/ValidateTokenResponse.dto'; // Você precisará criar este DTO
import { UsuarioService } from '../usuario/usuario.service';

@ApiTags('auth')
@ApiExtraModels(ListaTokenDTO, LoginResponseDTO, ProfileResponseDTO, MessageResponseDTO, TokensResponseDTO, ValidateTokenResponseDTO)
@ApiBearerAuth('bearer')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ 
    summary: 'Realiza login e retorna o token JWT', 
    description: 'Autentica um usuário com username e senha, retornando um token JWT válido que deve ser usado para autenticar requisições subsequentes.'
  })
  @ApiBody({ 
    type: LoginDTO,
    description: 'Credenciais do usuário para autenticação',
    required: true 
  })
  @ApiOkResponse({
    description: 'Login realizado com sucesso.',
    type: LoginResponseDTO,
    schema: {
      example: { 
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
   @ApiBadRequestResponse({ 
    description: 'Dados de entrada inválidos ou incompletos.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'O username não pode ser vazio',
          'O username deve ser uma string',
          'A senha não pode ser vazia',
          'A senha deve ser uma string'
        ],
        error: 'Bad Request'
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Credenciais inválidas.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      }
    }
  })
  signIn(@Body() signInDto: LoginDTO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('profile')
  @ApiOperation({ 
    summary: 'Retorna o perfil do usuário autenticado',
    description: 'Retorna informações do perfil do usuário baseado no token JWT fornecido no cabeçalho de autorização.'
  })
  @ApiOkResponse({
    description: 'Perfil do usuário retornado com sucesso.',
    type: ProfileResponseDTO,
    schema: {
      example: {
        sub: 'uuid-do-usuario',
        username: 'usuario1',
        email: 'usuario@email.com'
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token inválido ou ausente.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      }
    }
  })
  getProfile(@Request() req) {
    return this.usuarioService.buscaPorUsername(req.user.username);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Realiza logout revogando o token atual',
    description: 'Revoga o token JWT atual, invalidando-o para requisições futuras.'
  })
  @ApiOkResponse({ 
    description: 'Logout realizado com sucesso.',
    type: MessageResponseDTO,
    schema: {
      example: { 
        message: 'Logout realizado com sucesso' 
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token inválido ou ausente.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      }
    }
  })
  async logout(
    @Headers('Authorization') authorization: string
  ) {
    // O valor já vem como "Bearer <token>", basta passar para o serviço
    const token = authorization?.split(' ')[1];
    await this.authService.logout(token);
    return { message: 'Logout realizado com sucesso' };
  }

  @Get('validate')
  @ApiOperation({ 
    summary: 'Valida se o token atual é válido',
    description: 'Verifica se o token JWT fornecido é válido, não expirado e não revogado.'
  })
  @ApiOkResponse({
    description: 'Status da validação do token.',
    type: ValidateTokenResponseDTO,
    schema: { 
      example: { 
        valid: true 
      } 
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token inválido ou ausente.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      } 
    }
  })
  async validarToken(@Headers('Authorization') auth: string) {
    const token = auth?.split(' ')[1];
    const isValid = await this.authService.validateToken(token);
    return { valid: isValid };
  }
}
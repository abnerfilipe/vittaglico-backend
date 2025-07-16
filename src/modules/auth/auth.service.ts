import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { TokenService } from './token.service';
import { jwtConstants } from './constants';

export interface UsuarioPayload {
  sub: string;
  username: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usuarioService.buscaPorUsername(username);
    if (user?.senha !== pass) {
      throw new UnauthorizedException();
    }
    
    const payload: UsuarioPayload = { 
      email: user.email, 
      username: user.username, 
      sub: user.id 
    };
    
    const token = await this.jwtService.signAsync(payload);
    
    // Salva o token no banco de dados
    const expiresIn = 60; // 60 segundos, conforme configurado no JwtModule
    await this.tokenService.salvarToken(user.id, token, expiresIn);
    
    return {
      access_token: token,
    };
  }
  
  async logout(token: string): Promise<void> {
    await this.tokenService.revogarToken(token);
  }
  
  async validateToken(token: string): Promise<boolean> {
    try {
      // Verifica se o token é válido pelo JWT
      await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      
      // Verifica se o token está salvo e não revogado no banco
      return this.tokenService.verificarToken(token);
    } catch {
      return false;
    }
  }
}
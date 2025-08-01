import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { TokenService } from './token.service';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

export interface UsuarioPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usuarioService.buscaPorEmail(email);

    const usuarioFoiAutenticado = await bcrypt.compare(
      pass,
      user.senha,
    );
  
    if (!usuarioFoiAutenticado) {
      throw new UnauthorizedException('O email ou a senha está incorreto.');
    }
    
    const payload: UsuarioPayload = { 
      email: user.email, 
      sub: user.id 
    };
    
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    
    
    const expiresInSeconds = 60 * 60; 
    await this.tokenService.salvarToken(user.id, token, expiresInSeconds);

    return {
      access_token: token,
    };
  }
  
  async logout(token: string): Promise<void> {
    await this.tokenService.revogarTodosTokensDoUsuarioAhPartirDoToken(token);
  }
  
  async validateToken(token: string): Promise<boolean> {
    try {
      
      await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      
      
      return this.tokenService.verificarToken(token);
    } catch {
      return false;
    }
  }
  async validateTokenReturnPayload(token: string): Promise<UsuarioPayload | null> {
    try {

      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      
      const isValid = await this.tokenService.verificarToken(token);

      return isValid ? (payload as UsuarioPayload) : null;
    } catch {
      return null;
    }
  }
      
   
}
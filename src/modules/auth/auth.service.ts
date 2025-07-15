import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';

export interface UsuarioPayload {
  sub: string;
  username: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.buscaPorUsername(username);
    if (user?.senha !== pass) {
      throw new UnauthorizedException();
    }
    const payload: UsuarioPayload = { 
      email: user.email , 
      username: user.username, 
      sub: user.id 
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import { TokenEntity } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    private jwtService: JwtService,
  ) {}

  async salvarToken(usuarioId: string, token: string, expiresIn: number): Promise<TokenEntity> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    const tokenEntity = new TokenEntity();
    tokenEntity.token = token;
    tokenEntity.usuarioId = usuarioId;
    tokenEntity.expiresAt = expiresAt;

    return this.tokenRepository.save(tokenEntity);
  }

  async revogarToken(token: string): Promise<void> {
    await this.tokenRepository.update(
      { token },
      { isRevoked: true }
    );
  }

  async verificarToken(token: string): Promise<boolean> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { token, isRevoked: false }
    });

    if (!tokenEntity) {
      return false;
    }

    // Verifica se o token expirou
    return tokenEntity.expiresAt > new Date();
  }
  
  async removerTokensExpirados(): Promise<void> {
    await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
  }

  async buscarTokensPorUsuario(usuarioId: string): Promise<TokenEntity[]> {
    return this.tokenRepository.find({
      where: { 
        usuarioId, 
        isRevoked: false,
        expiresAt: MoreThan(new Date())
      }
    });
  }

  async revogarTokenPorId(tokenId: string, usuarioId: string): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId, usuarioId }
    });

    if (!token) {
      throw new NotFoundException('Token não encontrado ou não pertence ao usuário');
    }

    token.isRevoked = true;
    await this.tokenRepository.save(token);
  }

  async revogarTodosTokensExceto(usuarioId: string, tokenAtual: string): Promise<void> {
    await this.tokenRepository.update(
      { 
        usuarioId, 
        isRevoked: false,
        token: Not(tokenAtual)
      },
      { isRevoked: true }
    );
  }
}
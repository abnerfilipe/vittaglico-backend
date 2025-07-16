import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { TokenService } from './token.service';
import { TokenEntity } from './token.entity';

@Module({
  imports: [
    UsuarioModule,
    TypeOrmModule.forFeature([TokenEntity]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    TokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, TokenService],
})
export class AuthModule {}
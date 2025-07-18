import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../../modules/auth/constants';

@Injectable()
export class HashearSenhaPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  async transform(senha: string) {
    const sal = jwtConstants.secret;

    const senhaHasheada = await bcrypt.hash(senha, sal!);

    return senhaHasheada;
  }
}

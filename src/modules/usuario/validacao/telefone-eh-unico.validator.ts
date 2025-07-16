import { Injectable, NotFoundException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsuarioService } from '../usuario.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class TelefoneEhUnicoValidator implements ValidatorConstraintInterface {
  constructor(private usuarioService: UsuarioService) {}

  async validate(value: any): Promise<boolean> {
    try {
      const usuarioComTelefoneExiste = await this.usuarioService.buscaPorTelefone(
        value,
      );
      return !usuarioComTelefoneExiste;
    } catch (erro) {
      if (erro instanceof NotFoundException) {
        return true;
      }
      throw erro;
    }
  }
}

export const TelefoneEhUnico = (opcoesDeValidacao: ValidationOptions) => {
  return (objeto: object, propriedade: string) => {
    registerDecorator({
      target: objeto.constructor,
      propertyName: propriedade,
      options: opcoesDeValidacao,
      constraints: [],
      validator: TelefoneEhUnicoValidator,
    });
  };
};
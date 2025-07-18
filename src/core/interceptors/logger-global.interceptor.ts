import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
// Importa tipos do Fastify
import { FastifyRequest, FastifyReply } from 'fastify';
import { RequisicaoComUsuario } from '../../modules/auth/auth.guard';

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}

  intercept(contexto: ExecutionContext, next: CallHandler): Observable<any> {
    const contextoHttp = contexto.switchToHttp();

    // Usa tipos do Fastify
    const requisicao = contextoHttp.getRequest<FastifyRequest | RequisicaoComUsuario>();
    const resposta = contextoHttp.getResponse<FastifyReply>();

    const method = requisicao.method;
    const path = requisicao.url;
    const statusCode = resposta.statusCode;

    this.logger.log(`${method} ${path}`);

    const instantePreControlador = Date.now();

    return next.handle().pipe(
      tap(() => {
        if ('usuario' in requisicao) {
          this.logger.log(
            `Rota acessada pelo usuário: ${requisicao.usuario.sub}`,
          );
        }
        const tempoDeExecucaoDaRota = Date.now() - instantePreControlador;
        this.logger.log(
          `Resposta: status ${statusCode} - ${tempoDeExecucaoDaRota}ms`,
        );
      }),
    );
  }
}
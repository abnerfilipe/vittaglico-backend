import { Module, ConsoleLogger } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { FiltroDeExcecaoGlobal } from './filtros/filtro-de-excecao-global';
import { LoggerGlobalInterceptor } from './interceptors/logger-global.interceptor';

@Module({
  providers: [
    ConsoleLogger,
      {
      provide: APP_FILTER,
      useClass: FiltroDeExcecaoGlobal,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerGlobalInterceptor,
    },
  ],
})
export class CoreModule {}

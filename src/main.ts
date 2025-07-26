import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './modules/auth/auth.guard';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  const config = new DocumentBuilder()
    .setTitle('Vittaglico API')
    .setDescription(`
      Esta API é responsável por gerenciar usuários, autenticação e outras funcionalidades do sistema Vittaglico.
    `)
    .setVersion('0.0.1')
    .addServer('http://localhost:3000', 'Servidor de Desenvolvimento')
    .addServer('https://api.vittaglico.com.br', 'Servidor de Produção')
    .addTag('auth', 'Endpoints relacionados à autenticação')
    .addTag('usuario', 'Endpoints relacionados ao gerenciamento de usuários')
    .addTag('glicemia', 'Endpoints relacionados ao gerenciamento de glicemia')
    .addTag('insulina', 'Endpoints relacionados ao gerenciamento de insulina')
    .addTag('aplicacao-insulina', 'Endpoints relacionados ao gerenciamento de aplicações de insulina, sugestão de rodízio de local de aplicação e cálculo de correções de bolus')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira seu token JWT',
        in: 'header'
      },
      'bearer' 
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      deepLinking: true,
    },
    customSiteTitle: 'Vittaglico API - Documentação',
    customfavIcon: 'https://vittaglico.com.br/favicon.ico',
    jsonDocumentUrl: 'swagger/json',
  });

  const authGuard = app.get(AuthGuard);
  app.useGlobalGuards(authGuard);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.enableCors({
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'DNT', 'User-Agent', 'sec-ch-ua', 'sec-ch-ua-platform', 'sec-ch-ua-mobile', 'Referer'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000,'0.0.0.0');
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();
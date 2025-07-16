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
  // Configuração avançada do Swagger
  const config = new DocumentBuilder()
    .setTitle('Vittaglico API')
    .setDescription(`
      API de gerenciamento do sistema Vittaglico
      
      Esta API permite gerenciar usuários e autenticação.
      
       Características principais:
      - Sistema completo de autenticação JWT
      - Gestão de usuários
      - Revogação de tokens
      - Segurança baseada em tokens
      
      Para utilizar os endpoints protegidos, obtenha um token através do endpoint \`/auth/login\` 
      e inclua-o no cabeçalho de autorização como \`Bearer seu-token-aqui\`.
    `)
    .setVersion('0.0.1')
    .addServer('http://localhost:3000', 'Servidor de Desenvolvimento')
    .addServer('https://api.vittaglico.com.br', 'Servidor de Produção')
    .addTag('auth', 'Endpoints relacionados à autenticação')
    .addTag('usuario', 'Endpoints relacionados ao gerenciamento de usuários')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira seu token JWT',
        in: 'header'
      },
      'bearer' // ou 'bearer'
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

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();
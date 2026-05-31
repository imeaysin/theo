import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { connectDb } from '@repo/db';
import { env } from '@repo/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  await connectDb(env.MONGODB_URI);

  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
          ],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:', 'validator.swagger.io'],
        },
      },
    }),
  );
  app.enableCors({
    origin: env.WEB_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Next Monorepo API')
    .setDescription('The API specification for the NestJS backend services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      urls: [
        { url: 'docs-json', name: 'API' },
        { url: 'auth/open-api/generate-schema', name: 'Better Auth' },
      ],
      'urls.primaryName': 'API',
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Swagger UI: http://localhost:${port}/api/docs`);
  logger.log(`Better Auth reference: http://localhost:${port}/api/auth/reference`);
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error('Bootstrap failed', err);
  process.exit(1);
});

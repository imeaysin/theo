import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { connectDb } from '@repo/db';
import { env } from '@repo/config';

const SESSION_COOKIE = 'theo.session_token';

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
    .setDescription(
      'REST API for user management. Authentication endpoints are documented under the Better Auth spec.',
    )
    .setVersion('1.0')
    .addServer(env.NEXT_PUBLIC_API_URL, 'API')
    .addCookieAuth(SESSION_COOKIE, {
      type: 'apiKey',
      in: 'cookie',
      name: SESSION_COOKIE,
      description: 'Better Auth session cookie (set after sign-in)',
    })
    .addTag('Users', 'Authenticated user profile and admin user management')
    .build();

  const openApiDoc = cleanupOpenApiDoc(
    SwaggerModule.createDocument(app, config),
  );

  SwaggerModule.setup('docs', app, openApiDoc, {
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
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error('Bootstrap failed', err);
  process.exit(1);
});

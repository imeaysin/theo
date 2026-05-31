import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { connectDb } from '@repo/db';
import { env } from '@repo/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  await connectDb(env.MONGODB_URI);

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: env.WEB_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error('Bootstrap failed', err);
  process.exit(1);
});

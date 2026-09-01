import dotenv from 'dotenv';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

dotenv.config({
  path: resolve(process.cwd(), '../../.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3001);

  console.log('STAND API running on http://localhost:3001');
}

bootstrap();

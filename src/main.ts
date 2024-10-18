import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen('3333', '0.0.0.0').then(() => {
    console.log(`[nestjs-redis-websocket] HTTP server running on port: 3333!`);
  });
}
bootstrap();

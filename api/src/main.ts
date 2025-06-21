import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@shared/config/config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.port || 4000;

  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();

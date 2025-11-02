import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,           // 启用转换
    // whitelist: true,           // 去除未装饰的属性
    // forbidNonWhitelisted: true, // 禁止未装饰的属性
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

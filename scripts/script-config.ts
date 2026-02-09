import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';


export async function createScriptApp() {


  return  await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'] // 减少日志输出
  });

}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { I18nValidationPipe } from 'nestjs-i18n';
import { VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address
  app.use(cookieParser());
  app.useGlobalPipes(
    new I18nValidationPipe(),
  )
  app.setGlobalPrefix('api')
  app.enableVersioning({
    prefix: 'v',
    defaultVersion: '1', 
    type: VersioningType.URI
  })
  const configService = app.get(ConfigService)
  await app.listen(configService.get('APPLICATION_PORT') ?? 3000);
}
bootstrap(); 

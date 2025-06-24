import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [CaptchaService],
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.production']
  })],
  exports: [CaptchaService]
})
export class CaptchaModule { }

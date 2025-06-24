import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { ValidationModule } from 'src/validation/validation.module';
import { CaptchaModule } from 'src/captcha/captcha.module';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CodeController],
  providers: [CodeService],
  imports: [ValidationModule, CaptchaModule, UsersModule, ConfigModule]
})
export class CodeModule {}

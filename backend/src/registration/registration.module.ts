import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { ValidationModule } from 'src/validation/validation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService],
  imports: [DatabaseModule, AuthModule, ValidationModule, ConfigModule],
})
export class RegistrationModule {}
 
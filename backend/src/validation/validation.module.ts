import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ValidationController } from './validation.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [ValidationService],
  controllers: [ValidationController],
  imports: [DatabaseModule],
  exports: [ValidationService]
})
export class ValidationModule {}

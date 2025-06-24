import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
  imports: [DatabaseModule]
})
export class LikesModule {}

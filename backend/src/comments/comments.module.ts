import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [DatabaseModule]
})
export class CommentsModule {}

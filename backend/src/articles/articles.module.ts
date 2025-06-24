import { Module } from '@nestjs/common';
import { ArticleController } from './articles.controller';
import { ArticleService } from './articles.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [DatabaseModule],
  exports: [ArticleService]
}) 
export class ArticleModule {}

import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from 'src/articles/articles.module';

@Module({
  imports: [ConfigModule, ArticleModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
}) 
export class FileModule {}

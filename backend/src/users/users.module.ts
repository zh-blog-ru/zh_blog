import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';
import { JwtAuthStrategy } from 'src/auth/strategy/jwt.strategy';
import { ArticleModule } from 'src/articles/articles.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from 'src/file/file.module';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  providers: [UsersService, JwtAuthStrategy],
  imports: [DatabaseModule, ArticleModule, ConfigModule.forRoot({
    envFilePath: ['.env.production']
  }), FileModule, ValidationModule],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }

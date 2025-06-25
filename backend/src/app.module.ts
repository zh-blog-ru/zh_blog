import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './articles/articles.module';
import { DatabaseModule } from './database/database.module';
import { RegistrationModule } from './registration/registration.module';
import { CookieResolver, I18nModule } from 'nestjs-i18n';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/strategy/jwt.guard';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { CodeModule } from './code/code.module';
import { ValidationModule } from './validation/validation.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CaptchaModule } from './captcha/captcha.module';
import { FileModule } from './file/file.module';
import { CsrfModule } from './csrf/csrf.module';
import { CsrfMiddleware } from './csrf/csrf.middleware';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [AuthModule, UsersModule, ArticleModule, DatabaseModule, RegistrationModule,
    I18nModule.forRoot({
      fallbackLanguage: 'ru',
      loaderOptions: {
        path: './src/i18n/',
        watch: true,
      },
      resolvers: [
        { use: CookieResolver, options: ['locale'] }
      ],
      typesOutputPath: './src/i18n/generated/i18n.generated.ts',
    }),
    CommentsModule,
    LikesModule,
    CodeModule,
    ValidationModule,
    CacheModule.register({
      isGlobal: true,
    }),
    CaptchaModule,
    FileModule,
    CsrfModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 15,
        },
      ],
    }),
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .exclude({ path: '*', method: RequestMethod.GET })
      .exclude({ path: '*', method: RequestMethod.HEAD })
      .exclude({ path: '*', method: RequestMethod.OPTIONS })
      .forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtAuthStrategy],
    imports: [UsersModule,PassportModule.register({session: false}),
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule.forRoot({ envFilePath: '.env.production' }),], 
            async useFactory(configService): Promise<JwtModuleOptions> {
                const secret_Token_JWT = configService.get('JWT_TOKEN_SECRET')
                return {
                    secret: secret_Token_JWT,
                    signOptions: {
                        expiresIn: '24h'
                    },
                }
            },
            global: true
        })
    ],
    exports: [AuthService]
})
export class AuthModule { }

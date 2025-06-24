import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import * as jwt from 'jsonwebtoken';
import { ChangeEmail } from 'src/code/code.controller';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const reset_password = request.cookies['reset_password'];

        if (!reset_password) {
            throw new BadRequestException('Нет токена');
        }

        try {
            const secret = this.configService.get('JWT_TOKEN_SECRET')
            const resetPassword = jwt.verify(reset_password, secret) as { reset_password_email: string }
            const { reset_password_email } = resetPassword 
            request.resetPasswordEmail = reset_password_email
            return true;
        } catch (e) {
            throw new BadRequestException('Невалидный токен');
        }
    }
}
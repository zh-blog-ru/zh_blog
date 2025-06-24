import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import * as jwt from 'jsonwebtoken';
import { ChangeEmail } from 'src/code/code.controller';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChangeEmailGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user_jwt_payload = request.user as UserJWTInterfaces;
        const change_email = request.cookies['change_email'];

        if (!change_email) {
            throw new BadRequestException('Нет токена');
        }

        try {
            const secret = this.configService.get('JWT_TOKEN_SECRET')
            const changeEmail = jwt.verify(change_email, secret) as ChangeEmail 
            const { email: current_email } = await this.usersService.findUserById(user_jwt_payload.id);
            if (changeEmail.old_email !== current_email) {
                throw new BadRequestException('Невалидный токен')
            }
            request.changeEmailPayload = changeEmail
            return true;
        } catch (e) {
            throw new BadRequestException('Невалидный токен');
        }
    }
}
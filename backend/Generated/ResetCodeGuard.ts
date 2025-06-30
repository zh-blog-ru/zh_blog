import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ResetCode implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const reset_code = request.cookies['reset_code'];

        if (!reset_code) {
            throw new BadRequestException('Нет токена');
        }

        try {
            const secret = this.configService.get('JWT_TOKEN_SECRET')
            const resetPassword = jwt.verify(reset_code, secret) as { type: string, email: string }
            request.resetCode = resetPassword
            return true;
        } catch (e) {
            throw new BadRequestException('Невалидный токен');
        }
    }
}
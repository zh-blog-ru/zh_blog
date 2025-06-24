import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RegistrationGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const registration = request.cookies['registration'];
        const email = request.body.email
        if (!registration) {
            throw new BadRequestException();
        }

        try {
            const secret = this.configService.get('JWT_TOKEN_SECRET')
            const jwt_email = jwt.verify(registration, secret) as {registration_email : string};
            if (jwt_email.registration_email === email) {
                return true;
            } else {
                throw new BadRequestException('Невалидный токен');
            }
        } catch (e) {
            throw new BadRequestException('Невалидный токен');
        }
    }
}
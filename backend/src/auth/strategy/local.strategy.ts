import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { HttpFormException } from "Generated/HttpFormException";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { UserJWTInterfaces } from "interfaces/UserJWTInterfaces";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'LocalStrategy') {
    constructor(
        private readonly authService: AuthService,
        private readonly i18n: I18nService<I18nTranslations>
    ) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        })
    }

    async validate(username: string, password: string): Promise<UserJWTInterfaces> {
        const user_jwt_payload = await this.authService.validateUser(username, password)
        if (!user_jwt_payload) { 
            throw new HttpFormException({
                property: 'password', 
                errors: [this.i18n.t('validation.UNAUTHORIZED_LOCAL')]
            }, HttpStatus.UNAUTHORIZED)
        }
        return user_jwt_payload
    }
}
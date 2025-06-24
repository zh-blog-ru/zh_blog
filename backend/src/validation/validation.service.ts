import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { DatabaseService } from './../database/database.service';
import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { HttpFormException } from 'Generated/HttpFormException';

@Injectable()
export class ValidationService {
    private readonly logger = new Logger(ValidationService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly i18n: I18nService<I18nTranslations>,
    ) { }

    async checkUsername(username: string) {
        try {
            const isExists: { exists: boolean } = (await this.databaseService.query(`
            select exists (select 1 from users where username = $1);
            `, [username])).rows[0]
            return isExists.exists
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }
    async checkEmail(email: string) {
        try {
            const isExists: { exists: boolean } = (await this.databaseService.query(`
            select exists (select 1 from users where email = $1);
            `, [email])).rows[0]
            return isExists.exists
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async EmailIsExists(email: string, onIsExists: boolean) {
        const locale = I18nContext.current()?.lang
        const isExists = await this.checkEmail(email);
        if (onIsExists ? !isExists : isExists) {
            throw new HttpFormException({
                errors: [this.i18n.t(onIsExists ? 'validation.INVALID_EMAIL' : 'validation.EMAIL_IS_BUSY', { lang: locale })],
                property: 'email'
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async UsernameIsExists(username: string, onIsExists: boolean) {
        const locale = I18nContext.current()?.lang
        const isExists = await this.checkUsername(username);
        if (onIsExists ? !isExists : isExists) {
            throw new HttpFormException({
                errors: [this.i18n.t(onIsExists ? 'validation.MATCHES_USERNAME' : 'validation.USERNAME_IS_BUSY', { lang: locale })],
            property: 'username'
        }, HttpStatus.BAD_REQUEST);
    }
}
} 

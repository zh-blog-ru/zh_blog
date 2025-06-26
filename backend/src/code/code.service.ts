import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { readFileSync } from 'fs';
import { HttpFormException } from 'Generated/HttpFormException';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as nodemailer from 'nodemailer'
import { CaptchaService } from 'src/captcha/captcha.service';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export type EmailType = 'old_email' | 'new_email' | 'reset_password' | 'registration'

@Injectable()
export class CodeService {
    private readonly logger = new Logger(CodeService.name);
    private readonly transporter = nodemailer.createTransport({
        service: "yandex",
        host: 'smtp.yandex.ru',
        port: 465, 
        secure: true, 
        auth: {
            user: this.configService.get('SMTP_USER'),
            pass: this.configService.get('SMTP_PASSWORD'), 
        },
    });
    constructor(
        private readonly i18n: I18nService<I18nTranslations>,
        private readonly captchaService: CaptchaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService
    ) { }

    async validateCaptcha(token: string) {
        const locale = I18nContext.current()?.lang
        const isValid = await this.captchaService.checkCaptchaCloud(token);
        if (!isValid) {
            throw new HttpFormException({
                errors: [this.i18n.t('validation.INCORRECT_CAPTCHA', { lang: locale })],
                property: 'captcha'
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async verifyCode(email: string, code: string, type: EmailType) {
        const locale = I18nContext.current()?.lang
        const cacheCode = await this.cacheManager.get(JSON.stringify({ email, type }));
        if (cacheCode !== code) {
            throw new HttpFormException({
                errors: [this.i18n.t('validation.INCORRECT_CODE', { lang: locale })],
                property: 'code'
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async handleCodeOperation(email: string, type: EmailType) {
        await this.cacheManager.del(JSON.stringify({ email, type }));

        const code = this.generateCode()
        await this.sendEmail(email, code.toString(), type);
        await this.cacheManager.set(JSON.stringify({ email, type }), code, 300 * 1000);

        return code;
    }

    async sendEmail(email: string, code: string, type: EmailType) {
        const messageTemplate = readFileSync(
            `./src/code/template/${type}.html`,
            'utf8'
        )
        const html = messageTemplate.replace('{{CODE}}', code)
        try {
            const info = await this.transporter.sendMail({
                from: this.configService.get('SMTP_USER'),
                to: email,
                subject: "Код подтверждения для входа",
                html
            });
            console.log("Message sent:", info.messageId); 
            console.log("Message sent:", info);
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException('Не удается отправить сообщение')
        }

    }
    generateCode(length: number = 6, options: { digitsOnly?: boolean, excludeSimilarChars?: boolean } = {}): string {
        // Настройки по умолчанию
        const { digitsOnly = false, excludeSimilarChars = true } = options;

        let chars = digitsOnly
            ? '0123456789'
            : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Исключаем похожие символы (если нужно)
        if (excludeSimilarChars && !digitsOnly) {
            const similarChars = ['0', 'O', '1', 'I', '2', 'Z', '5', 'S', '8', 'B'];
            chars = chars.split('').filter(c => !similarChars.includes(c)).join('');
        }

        // Используем crypto API для большей безопасности
        const randomValues = new Uint32Array(length);
        crypto.getRandomValues(randomValues);

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[randomValues[i] % chars.length];
        }

        return result;
    }
}

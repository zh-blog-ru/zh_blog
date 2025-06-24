import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CaptchaService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async checkCaptcha(token: string): Promise<boolean> {
        const private_key = this.configService.get('YANDEX_CAPTCHA')
        const postData = new URLSearchParams({
            secret: private_key,
            token: token,
        }).toString();
        const url = "https://smartcaptcha.yandexcloud.net/validate";
        const result = await fetch(url, {
            body: postData,
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

        });
        const outcome = await result.json();
        return outcome.status === 'ok'
    }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CaptchaService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async checkCaptchaYandex(token: string): Promise<boolean> {
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

    async checkCaptchaCloud(token: string): Promise<boolean> {
    const secretKey = this.configService.get('CLOUD_CAPTCHA');
    
    // Формируем тело запроса
    const postData = new URLSearchParams({
        secret: secretKey,
        response: token,
        // remoteip: ip // опционально - можно передать IP пользователя
    });

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
        });

        const data = await response.json();
        console.log(data)
        // Cloudflare возвращает success: true/false
        return data.success === true;
        
    } catch (error) {
        console.error('Cloudflare captcha validation error:', error);
        return false; // В случае ошибки считаем капчу не пройденной
    }
}
}

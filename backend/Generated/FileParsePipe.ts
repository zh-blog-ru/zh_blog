import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { HttpFormException } from './HttpFormException';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

const DEFAULT_MAX_SIZE = 1024 * 1024 * 2; // 2 МБ
const DEFAULT_ALLOWED_TYPES = /^(image\/jpeg|image\/png|image\/webp)$/;

@Injectable()
export class FileParsePipe implements PipeTransform {
    constructor(
        private readonly i18n: I18nService<I18nTranslations>,
    ) {
    }

    transform(file: Express.Multer.File) {
        const locale = I18nContext.current()?.lang

        const allowedTypes = DEFAULT_ALLOWED_TYPES
        const maxSize = DEFAULT_MAX_SIZE

        if (!allowedTypes.test(file.mimetype)) {
            throw new HttpFormException({
                errors: [this.i18n.t('validation.INCORRECT_FILETYPE', { lang: locale })],
                property: 'image'
            }, HttpStatus.BAD_REQUEST);
        }

        if (file.size > maxSize) {
            throw new HttpFormException({
                errors: [this.i18n.t('validation.INCORRECT_FILESIZE', { lang: locale })],
                property: 'image'
            }, HttpStatus.BAD_REQUEST);
        }

        return file;
    }
}
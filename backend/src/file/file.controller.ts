import { Controller, Get, NotFoundException, Param, Res, UseFilters, ValidationPipe } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { ProfileUrlDTO } from 'DTO/ProfileUrlDto.dto';
import { isPublic } from 'Generated/PublicDecorator';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';
import { ConfigService } from '@nestjs/config';

@Controller('file')
export class FileController {

    constructor(
        private readonly configService: ConfigService,
    ) { }

    @UseFilters(ExcepMultiLangFilter)
    @isPublic()
    @Get('photo/public/:profile_picture_url')
    getPhoto(@Param(ValidationPipe) { profile_picture_url }: ProfileUrlDTO, @Res() res: Response) {
        console.log(profile_picture_url)
        const upload_path = this.configService.get('STABLE_IMAGES_PATH')
        const filePath = join(process.cwd(), upload_path, profile_picture_url)
        if (!existsSync(filePath)) {
            return res.status(404).send('File not found');
        }

        res.sendFile(filePath, {
            headers: {
                'Content-Type': 'image/jpeg',
            },
        }, (err) => {
            if (err) {
                // Подавляем все ошибки и возвращаем 404
                // throw new NotFoundException('File not found');
                return 'not_found'
            }
        });

    }
}

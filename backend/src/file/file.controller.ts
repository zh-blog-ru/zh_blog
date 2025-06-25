import { Controller, Get,  Param,  Res, ValidationPipe } from '@nestjs/common';
import { FileService } from './file.service';
import { existsSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { ProfileUrlDTO } from 'DTO/ProfileUrlDto.dto';
import { isPublic } from 'Generated/PublicDecorator';

@Controller('file')
export class FileController {

    @isPublic()
    @Get('photo/public/:profile_picture_url')
    getPhoto(@Param(ValidationPipe) {profile_picture_url}: ProfileUrlDTO, @Res() res: Response) {

        const filePath = join(process.cwd(), 'uploads/stable/images', profile_picture_url);

        if (!existsSync(filePath)) {
            return res.status(404).send('File not found');
        }
        
        res.sendFile(filePath, {
            headers: {
                'Content-Type': 'image/jpeg',
            },
        });

    }
}

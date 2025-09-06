import { ArticleService } from './../articles/articles.service';
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Req, Res, UploadedFile, UseFilters, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { ProfileUrlDTO } from 'DTO/ProfileUrlDto.dto';
import { isPublic } from 'Generated/PublicDecorator';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';
import { ConfigService } from '@nestjs/config';
import { isAdmin } from 'Generated/AdminDecorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileParsePipe } from 'Generated/FileParsePipe';
import { FileOptimizationPipe } from 'Generated/FileOptimizationPipe';
import { FileService } from './file.service';

@Controller('file')
export class FileController {

    constructor(
        private readonly configService: ConfigService,
        private readonly fileService: FileService,
        private readonly articleService: ArticleService,
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
                throw new NotFoundException('File not found');
                // return 'not_found'
            }
        });

    }

    @isAdmin()
    @UseFilters(ExcepMultiLangFilter)
    @Post('/article/image/:article_id')
    @UseInterceptors(FileInterceptor('image'))
    async addImageToArticle(@UploadedFile(
        FileParsePipe,
        new FileOptimizationPipe()
    ) file: Express.Multer.File, @Req() req: Request, @Param('article_id', ParseIntPipe) article_id: number) {
        const uploadPath = this.configService.get('STABLE_IMAGES_PATH')
        const filename = await this.fileService.savePhoto(uploadPath, file.buffer)
        console.log('FILENAME: ', filename) 
        await this.articleService.addImagesToArticles(article_id, filename)
        return {filename}
    }

    @isAdmin()
    @UseFilters(ExcepMultiLangFilter)
    @Delete('/article/image/:article_id')
    async deleteImageToArticle(@Body(new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
      skipUndefinedProperties: true
    })) { profile_picture_url: filename }: ProfileUrlDTO, @Req() req: Request, @Param('article_id', ParseIntPipe) article_id: number) {
        const uploadPath = this.configService.get('STABLE_IMAGES_PATH')
        await this.fileService.deleteFile(uploadPath, filename)
        await this.articleService.deleteImagesToArticles(article_id, filename)
    }
}
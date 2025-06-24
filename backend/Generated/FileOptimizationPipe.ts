import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as FileType from 'file-type';
import * as sharp from 'sharp';


@Injectable()
export class FileOptimizationPipe implements PipeTransform {
    private readonly supportedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];


    constructor(private readonly options: { quality?: number } = {quality: 80}) { } // Принимаем параметры

    async transform(file: Express.Multer.File, metadata: ArgumentMetadata): Promise<Express.Multer.File | void>  {
        try {
            // Validate file type
            const type = await FileType.fileTypeFromBuffer(file.buffer);

            if (!type || !this.supportedMimeTypes.includes(type.mime)) {
                throw new BadRequestException('Unsupported image format. Please upload JPEG, PNG or WebP.');
            }

            const quality = this.options.quality;
            const optimizedBuffer = await sharp(file.buffer)
                .rotate() // Auto-orient based on EXIF
                .withMetadata({
                }) // Remove all metadata
                .jpeg({
                    quality,
                    mozjpeg: true,
                    progressive: true // Better for web
                })
                .toBuffer();

            return {
                ...file,
                buffer: optimizedBuffer,
                size: optimizedBuffer.length,
                mimetype: 'image/jpeg'
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to process image');
        }
    }
}
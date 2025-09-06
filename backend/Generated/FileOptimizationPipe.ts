import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import * as FileType from 'file-type';
import * as sharp from 'sharp';

interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: keyof sharp.FitEnum;
  withoutEnlargement?: boolean;
}

interface FileOptimizationOptions {
  quality?: number;
  resize?: ResizeOptions | boolean; // Можно передать объект с настройками или true/false
  maxDimension?: number; // Альтернативный вариант: максимальный размер
}

@Injectable()
export class FileOptimizationPipe implements PipeTransform {
  private readonly supportedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];
  private readonly logger = new Logger(FileOptimizationPipe.name);

  constructor(private readonly options: FileOptimizationOptions = { quality: 80 }) { }

  async transform(file: Express.Multer.File, metadata: ArgumentMetadata): Promise<Express.Multer.File | void> {
    try {
      // Validate file type
      console.log('file.size: ', file.size);
      const type = await FileType.fileTypeFromBuffer(file.buffer);

      if (!type || !this.supportedMimeTypes.includes(type.mime)) {
        throw new BadRequestException('Unsupported image format. Please upload JPEG, PNG or WebP.');
      }

      const quality = this.options.quality || 80;
      
      // Создаем базовый экземпляр sharp
      let sharpInstance = sharp(file.buffer, {
        limitInputPixels: 20 * 1024 * 1024
      }).rotate().withMetadata();

      // Применяем resize в зависимости от опций
      if (this.options.resize) {
        if (typeof this.options.resize === 'boolean' && this.options.resize) {
          // Если resize: true - используем дефолтные настройки
          sharpInstance = sharpInstance.resize({
            width: 720,
            height: 720,
            fit: 'inside',
            withoutEnlargement: true
          });
        } else if (typeof this.options.resize === 'object') {
          // Если переданы кастомные настройки resize
          sharpInstance = sharpInstance.resize(this.options.resize);
        }
      } else if (this.options.maxDimension) {
        // Альтернативный вариант: ограничение по максимальному размеру
        sharpInstance = sharpInstance.resize({
          width: this.options.maxDimension,
          height: this.options.maxDimension,
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      const optimizedBuffer = await sharpInstance
        .jpeg({
          quality,
          mozjpeg: true,
          progressive: true
        })
        .toBuffer();

      console.log('Optimized size:', optimizedBuffer.length);
      
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
      this.logger.error(error);
      throw new BadRequestException('Failed to process image');
    }
  }
}
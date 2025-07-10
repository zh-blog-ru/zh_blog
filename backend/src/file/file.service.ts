import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import { copyFile, mkdir, readFile, unlink, writeFile } from 'fs/promises';
import * as path from 'path';
import { join } from 'path';

@Injectable()
export class FileService {



    private readonly logger = new Logger(FileService.name);

    async savePhoto(uploadPath: string, data: Buffer) {
        try {
            if (!existsSync(uploadPath)) {
                await mkdir(uploadPath, { recursive: true });
            }
            const filename = `${uuidv4()}.jpg`;
            const filePath = path.join(uploadPath, filename);
            await writeFile(filePath, data);
            return filename
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async getFile(path: string) {
        try {
            if (!existsSync(path)) {
                throw new NotFoundException('Not found file')
            }
            return await readFile(path);
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async deleteFile(upload_path: string, profile_picture_url: string) {
        try {
            const path = join(process.cwd(), upload_path, profile_picture_url)
            if (!existsSync(path)) {
                throw new NotFoundException('Not found file')
            }
            return await unlink(path);
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async copyFile(
        sourcePath: string,
        destinationPath: string,
    ): Promise<void> {
        try {
            if (!existsSync(destinationPath)) {
                await mkdir(path.dirname(destinationPath), { recursive: true });
            }
            await copyFile(sourcePath, destinationPath);
        } catch (error) {
            throw new Error(`Failed to copy file`);
        }
    }
}

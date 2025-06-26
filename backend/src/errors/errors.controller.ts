import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { isPublic } from 'Generated/PublicDecorator';

@Controller('errors')
export class ErrorsController {
    private readonly logger = new Logger(ErrorsController.name);

    @isPublic()
    @Post()
    getErrors(@Body() erros: any) {
        this.logger.error(erros)
    }
}

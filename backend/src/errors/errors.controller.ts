import { Body, Controller, Get, Post } from '@nestjs/common';
import { isPublic } from 'Generated/PublicDecorator';

@Controller('errors')
export class ErrorsController {

    @isPublic()
    @Post()
    getErrors(@Body() erros: any) {
        console.log('ERRORS')
        console.log(erros)
    }
}

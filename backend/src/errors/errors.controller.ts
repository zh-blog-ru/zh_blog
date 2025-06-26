import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('errors')
export class ErrorsController {

    @Post()
    getErrors(@Body() erros: any) {
        console.log(erros)
    }
}

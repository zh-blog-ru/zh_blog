import { UsernameDTO } from 'DTO/Username.dto';
import { ValidationService } from './validation.service';
import { Controller, Get, Param, UseFilters, ValidationPipe } from '@nestjs/common';
import { isPublic } from 'Generated/PublicDecorator';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';
import { isAdmin } from 'Generated/AdminDecorator';

@Controller('validation')
export class ValidationController {
    constructor(
        private readonly validationService: ValidationService
    ) { }


    @UseFilters(ExcepMultiLangFilter)
    @isPublic()
    @Get('username/:username')
    async checkUsername(@Param(ValidationPipe) username: UsernameDTO) {
        await this.validationService.UsernameIsExists(username.username, false)
    }

    @Get('admin')
    @isAdmin()
    isAdmin() {}
} 

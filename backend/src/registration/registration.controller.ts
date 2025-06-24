import { Request, Response } from 'express';
import { RegistrationService } from './registration.service';
import { Body, Controller, Post, Req, Res, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'DTO/CreateUserDto.dto';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';
import { AuthService } from 'src/auth/auth.service';
import { isPublic } from 'Generated/PublicDecorator';
import { RegistrationGuard } from 'Generated/RegistrationGuard';
@Controller('registration')
export class RegistrationController {

    constructor(
        private readonly registrationService: RegistrationService,
        private readonly authService: AuthService,
    ) { }


    @isPublic()
    @UseFilters(ExcepMultiLangFilter)
    @UseGuards(RegistrationGuard)
    @Post()
    async createUser(@Body(new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
        transform: true,
    })) body: CreateUserDto, @Res({ passthrough: true }) response: Response) {
        const user_jwt_payload = await this.registrationService.createUser(body)
        const jwt_token = await this.authService.createJWT(user_jwt_payload)
        response.cookie('jwt', jwt_token, { sameSite: 'lax', httpOnly: true, secure: true, maxAge: 3600 * 1000 * 24 })
        return {id: user_jwt_payload.id}
    }
}

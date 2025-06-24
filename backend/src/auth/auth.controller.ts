import { Body, Controller, Post, Req, Scope, ValidationPipe, UseGuards, UseFilters, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './strategy/local.guard';
import { LoginUserDto } from 'DTO/LoginUserDto.dto';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';
import { isPublic } from 'Generated/PublicDecorator';

@Controller({
    path: 'auth',
    scope: Scope.DEFAULT
})
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @isPublic()
    @UseFilters(ExcepMultiLangFilter)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async Login(@Body(new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
        transform: true,
    })) body: LoginUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        const jwt_token = await this.authService.createJWT(user_jwt_payload)
        res.cookie('jwt', jwt_token, {
            sameSite: 'lax',
            httpOnly: true, secure: true, maxAge: 3600 * 1000 * 24
        })
        return { id: user_jwt_payload.id }

    }


    @UseFilters(ExcepMultiLangFilter)
    @Post('logout')
    async Logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt', {
            sameSite: 'lax',
            httpOnly: true, secure: true, maxAge: 3600 * 1000 * 24
        })
    }
}
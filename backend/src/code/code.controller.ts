import { ValidationService } from 'src/validation/validation.service';
import { UsersService } from './../users/users.service';
import { isPublic } from 'Generated/PublicDecorator';
import { CodeService, EmailType } from './code.service';
import { Body, Controller, Post, Req, Res, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';
import { CheckCodeDto, CheckCodeNoEmailDto, RegistrationCodeDto, SendCodeDto } from 'DTO/CodeBodyDto.dto';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import { ChangeEmailGuard } from 'Generated/ChangeEmailGuard';
import { ResetCode } from 'Generated/ResetCodeGuard';

export interface ChangeEmail {
    old_email: string,
    new_email: string | null
}

@UseFilters(ExcepMultiLangFilter)
@Controller('code')
export class CodeController {


    constructor(
        private readonly codeService: CodeService,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly validationService: ValidationService,

    ) { }


    @isPublic()
    @UseGuards(ResetCode)
    @Post('reset_code')
    async resetCode(@Req() req: Request & { resetCode: { type: EmailType, email: string } }) {
        const email = req.resetCode.email
        const type = req.resetCode.type

        await this.codeService.handleCodeOperation(email, type);
    }

    @Post('send/old_email')
    async sendCodeToOldEmail(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const type = 'old_email'
        const user_jwt_payload = req.user as UserJWTInterfaces;
        const { email } = await this.usersService.findUserById(user_jwt_payload.id);
        await this.codeService.handleCodeOperation(email, type);

        const jwt_reset_code = this.jwtService.sign({
            email,
            type
        }, { expiresIn: '5m' });
        res.cookie('reset_code', jwt_reset_code, { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 });

    }

    @Post('check/old_email')
    async checkCodeToOldEmail(
        @Req() req: Request,
        @Body(new ValidationPipe({ whitelist: true, stopAtFirstError: true, transform: true }))
        { code }: CheckCodeNoEmailDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const user_jwt_payload = req.user as UserJWTInterfaces;
        const { email } = await this.usersService.findUserById(user_jwt_payload.id);
        await this.codeService.verifyCode(email, code, 'old_email');

        const jwt_change_email = this.jwtService.sign({
            old_email: email,
            new_email: null
        }, { expiresIn: '5m' });

        res.cookie('change_email', jwt_change_email, { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 });
    }

    @UseGuards(ChangeEmailGuard)
    @Post('send/new_email')
    async sendCodeToNewEmail(
        @Body(new ValidationPipe({ whitelist: true, stopAtFirstError: true, transform: true }))
        { email, token }: SendCodeDto, @Res({ passthrough: true }) res: Response
    ) {
        const type = 'new_email'
        await this.codeService.validateCaptcha(token);
        await this.validationService.EmailIsExists(email, false);
        await this.codeService.handleCodeOperation(email, type);

        const jwt_reset_code = this.jwtService.sign({
            email,
            type
        }, { expiresIn: '5m' });
        res.cookie('reset_code', jwt_reset_code, { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 });
    }

    @UseGuards(ChangeEmailGuard)
    @Post('check/new_email')
    async checkCodeToNewEmail(
        @Req() req: Request & { changeEmailPayload: ChangeEmail },
        @Body(new ValidationPipe({ whitelist: true, stopAtFirstError: true, transform: true }))
        { code, email }: CheckCodeDto,
        @Res({ passthrough: true }) res: Response
    ) {
        await this.codeService.verifyCode(email, code, 'new_email');

        const changeEmailPayload = req?.changeEmailPayload as ChangeEmail;
        const jwt_change_email = this.jwtService.sign({
            old_email: changeEmailPayload.old_email,
            new_email: email
        }, { expiresIn: '5m' });

        res.cookie('change_email', jwt_change_email, { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 });
    }

    @isPublic()
    @Post('send/registration')
    async sendCodeToRegistration(
        @Body(new ValidationPipe({ whitelist: true, transform: true }))
        { email, token, username }: RegistrationCodeDto, @Res({ passthrough: true }) res: Response
    ) {

        const type = 'registration'
        await this.codeService.validateCaptcha(token);
        await this.validationService.UsernameIsExists(username, false);
        await this.validationService.EmailIsExists(email, false);
        await this.codeService.handleCodeOperation(email, type);

        const jwt_reset_code = this.jwtService.sign({
            email,
            type
        }, { expiresIn: '5m' });
        res.cookie('reset_code', jwt_reset_code, { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 });
    }

    @isPublic()
    @Post('check/registration')
    async checkCodeToRegistration(
        @Req() req: Request,
        @Body(new ValidationPipe({ whitelist: true, stopAtFirstError: true, transform: true }))
        { code, email }: CheckCodeDto,
        @Res({ passthrough: true }) res: Response
    ) {
        await this.codeService.verifyCode(email, code, 'registration');

        const jwt_registration = this.jwtService.sign({
            registration_email: email,
        }, { expiresIn: '5m' });

        res.cookie('registration', jwt_registration, { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 });
    }

    @isPublic()
    @Post('send/reset_password')
    async sendCodeToResetPassword(
        @Body(new ValidationPipe({ whitelist: true, stopAtFirstError: true, transform: true }))
        { email, token }: SendCodeDto, @Res({ passthrough: true }) res: Response
    ) {

        const type = 'reset_password'

        await this.codeService.validateCaptcha(token);
        await this.validationService.EmailIsExists(email, true);
        await this.codeService.handleCodeOperation(email, type);

        const jwt_reset_code = this.jwtService.sign({
            email,
            type
        }, { expiresIn: '5m' });
        res.cookie('reset_code', jwt_reset_code, { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 });
    }

    @isPublic()
    @Post('check/reset_password')
    async checkCodeToResetPassword(
        @Body(new ValidationPipe({ whitelist: true, stopAtFirstError: true, transform: true }))
        { code, email }: CheckCodeDto,
        @Res({ passthrough: true }) res: Response
    ) {
        await this.codeService.verifyCode(email, code, 'reset_password');

        const jwt_reset_password = this.jwtService.sign({
            reset_password_email: email,
        }, { expiresIn: '5m' });

        res.cookie('reset_password', jwt_reset_password, { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 });
    }
}

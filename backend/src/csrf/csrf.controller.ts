import { Response } from 'express';
import { CsrfService } from './csrf.service';
import { Controller, Get, Res } from '@nestjs/common';
import { isPublic } from 'Generated/PublicDecorator';

@Controller('csrf')
export class CsrfController {

    constructor(
        private readonly csrfService: CsrfService
    ) { }

    @isPublic()
    @Get('get_token')
    getCsrfToken(@Res() res: Response) {

        const token = this.csrfService.generateToken();

        res.cookie('XSRF-TOKEN', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
        });

        return res.json({ csrfToken: token });
    }
}


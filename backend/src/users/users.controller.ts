import { FileService } from './../file/file.service';
import { ArticleService } from './../articles/articles.service';
import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Res, UploadedFile, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { isPublic } from 'Generated/PublicDecorator';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import { PrivateUserInterfaces, PublicUserInterfaces } from './Interfaces';
import { ChangeEmailGuard } from 'Generated/ChangeEmailGuard';
import { UpdateUserDto } from 'DTO/UpdateUserDto.dto';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';
import { ChangeEmail } from 'src/code/code.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileOptimizationPipe } from 'Generated/FileOptimizationPipe';
import { ResetPasswordGuard } from 'Generated/ResetPasswordGuard';
import { ResetPasswordDTO } from 'DTO/ResetPassword.dto';
import { ChangePasswordDto } from 'DTO/ChangePassowrdDto.dto';
import { join } from 'path';
import { FileParsePipe } from 'Generated/FileParsePipe';
import { ValidationService } from 'src/validation/validation.service';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
        private readonly articleService: ArticleService,
        private readonly fileService: FileService,
        private readonly validationService: ValidationService,
        private readonly jwtService: JwtService
    ) { }


    @Get("me")
    async getCurrentUser(@Req() req: Request): Promise<PrivateUserInterfaces> {
        const user_jwt_payload = req.user as UserJWTInterfaces
        const user = await this.usersService.findUserById(user_jwt_payload.id)
        return {
            ...user,
            isOwner: true
        } as PrivateUserInterfaces
    }

    @isPublic()
    @Get(":id")
    // Используя ParseIntPipe я  не могу сделать internationalization error
    async getPublicUserById(@Req() req: Request, @Param('id', ParseIntPipe) id: number):
        Promise<PublicUserInterfaces | PrivateUserInterfaces> {
        const user_jwt_payload = req.user as UserJWTInterfaces | null
        const user = await this.usersService.findUserById(id)
        const isOwner = user_jwt_payload && (user_jwt_payload.id === id || user_jwt_payload.role == 'admin');

        if (isOwner) {
            return { ...user, isOwner: true } as PrivateUserInterfaces;
        } else {
            const { email, ...publicData } = user; // Remove email property
            return { ...publicData, isOwner: false } as PublicUserInterfaces;
        }
    }

    @Delete('me/delete')
    async deleteAccount(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        const profile_picture_url: null | string = await this.usersService.deleteAccount(user_jwt_payload.id)
        if (profile_picture_url) {
            const filePath = join(process.cwd(), 'uploads/stable/images', profile_picture_url)
            await this.fileService.deleteFile(filePath)
        }
        res.clearCookie('jwt', {
            sameSite: 'lax',
            httpOnly: true, secure: true, maxAge: 3600 * 1000 * 24
        })
    }

    @Get("me/liked_articles")
    async getArticlesLikedUser(@Req() req: Request) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        const articles = await this.articleService.getArticlesLikedUser(user_jwt_payload.id)
        return articles
    }

    @Patch('me/photo')
    @UseInterceptors(FileInterceptor('image'))
    async uploadProfileImage(@UploadedFile(
        FileParsePipe,
        new FileOptimizationPipe()
    ) file: Express.Multer.File, @Req() req: Request) {
        const user_jwt_payload = (req.user as UserJWTInterfaces)
        const filename = await this.fileService.savePhoto('./uploads/stable/images', file.buffer)
        await this.usersService.changeProfileImage(user_jwt_payload.id, filename)
    }

    @Delete('me/photo')
    async deleteProfileImage(@Req() req: Request) {
        const user_jwt_payload = (req.user as UserJWTInterfaces)
        const old_profile_picture_url = await this.usersService.changeProfileImage(user_jwt_payload.id, null)
        console.log('old_profile_picture_url: ', old_profile_picture_url)
        const filePath = join(process.cwd(), 'uploads/stable/images', old_profile_picture_url)
        this.fileService.deleteFile(filePath)
    }

    @UseGuards(ChangeEmailGuard)
    @Patch('me/change_email')
    async changeEmail(@Req() req: Request & { changeEmailPayload: ChangeEmail }, @Res({ passthrough: true }) res: Response) {
        const user_jwt_payload = (req.user as UserJWTInterfaces)
        const new_email = req.changeEmailPayload.new_email as string
        const text = await this.usersService.ChangeEmail(user_jwt_payload.id, new_email)
        res.clearCookie('change_email', { sameSite: 'strict', secure: true, httpOnly: true, maxAge: 1000 * 300 })
        res.json({
            text
        })
    }

    @UseFilters(ExcepMultiLangFilter)
    @Patch('me/change_password')
    async changePassword(@Body(new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
        transform: true,
    })) body: ChangePasswordDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const newPassword = body.newPassword
        const password = body.password
        const user_jwt_payload = (req.user as UserJWTInterfaces)
        const text = await this.usersService.changePassword(user_jwt_payload.id, password, newPassword)
        res.json({
            text
        })
    }

    @UseFilters(ExcepMultiLangFilter)
    @Patch('me')
    async changeProfile(
        @Body(new ValidationPipe({
            whitelist: true,
            stopAtFirstError: true,
            transform: true,
        })) { username, about_me }: UpdateUserDto,
        @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        if (username !== user_jwt_payload.username) {
            await this.validationService.UsernameIsExists(username, false);
        }
        const jwt_payload = await this.usersService.changeProfile({
            username,
            about_me,
            id: user_jwt_payload.id
        })
        const jwt = this.jwtService.sign(jwt_payload)
        res.cookie('jwt', jwt, {
            sameSite: 'lax',
            httpOnly: true, secure: true, maxAge: 3600 * 1000 * 24
        })
    }


    @isPublic()
    @UseFilters(ExcepMultiLangFilter)
    @Patch('me/reset_password')
    @UseGuards(ResetPasswordGuard)
    async resetPassword(@Body(new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
        transform: true,
    })) body: ResetPasswordDTO, @Req() req: Request & { resetPasswordEmail: string }, @Res({ passthrough: true }) res: Response) {
        const email = req.resetPasswordEmail
        const newPassword = body.password
        await this.usersService.resetPassword(email, newPassword)
        res.clearCookie('reset_password', { sameSite: 'strict', secure: true, httpOnly: true })
    }
}

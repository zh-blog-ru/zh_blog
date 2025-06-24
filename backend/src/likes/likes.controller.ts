import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, ValidationPipe } from '@nestjs/common';
import { Request } from 'express'; ``
import { isPublic } from 'Generated/PublicDecorator';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import { LikesService } from './likes.service';
import { SetLikeDto } from 'DTO/SetLikeDto.dto';

@Controller('articles/:article_id/likes')
export class LikesController {

    constructor(
        private readonly likesService: LikesService,
    ) { }

    @isPublic()
    @Get()
    async getLikes(@Param('article_id', ParseIntPipe) article_id: number, @Req() req: Request) {
        const user_jwt_payload = req.user as UserJWTInterfaces | null
        const likes = await this.likesService.getLikes(article_id, user_jwt_payload?.id)
        return likes
    }

    @Post()
    async setLike(@Param('article_id', ParseIntPipe) article_id: number, @Req() req: Request, @Body(
        new ValidationPipe({
            whitelist: true,
            stopAtFirstError: true,
            transform: true,
        })) { isLike }: SetLikeDto) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        await this.likesService.setLike(article_id, user_jwt_payload.id, isLike)
    }

    @Delete()
    async deleteLike(@Param('article_id', ParseIntPipe) article_id: number, @Req() req: Request) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        await this.likesService.deleteLike(article_id, user_jwt_payload.id)
    }
}
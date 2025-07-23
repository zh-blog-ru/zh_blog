import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UseFilters, ValidationPipe } from '@nestjs/common';
import { isPublic } from 'Generated/PublicDecorator';
import { CommentsService } from './comments.service';
import { Request, Response } from 'express';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import { CreateCommentDto, } from 'DTO/CreateCommentDto.dto';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';


@Controller('articles/:article_id/comments')
export class CommentsController {

    constructor(
        private readonly commentsService: CommentsService,
    ) { }

    @isPublic()
    @Get()
    async getCommentsByArticleId(@Param('article_id', ParseIntPipe) article_id: number, @Query('page', new ParseIntPipe({
        optional: true
    })) page: number, @Req() req: Request) {
        const user_jwt_payload = req.user as UserJWTInterfaces | null
        const comments = await this.commentsService.getCommentsByArticleId(article_id, page ?? 1, user_jwt_payload?.id)
        return comments
    }

    @UseFilters(ExcepMultiLangFilter)
    @Post()
    async setComment(@Param('article_id', ParseIntPipe) article_id: number, @Body(
        new ValidationPipe({
            whitelist: true,
            stopAtFirstError: true,
            transform: true,
        })) body: CreateCommentDto, @Req() req: Request) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        const comment = await this.commentsService.setComment(user_jwt_payload.id, article_id, body.comment)
        return comment
    }

    @UseFilters(ExcepMultiLangFilter)
    @Patch('/:comment_id')
    async changeComment(@Param('article_id', ParseIntPipe) article_id: number, @Param('comment_id', ParseIntPipe) comment_id: number, @Body(
        new ValidationPipe({
            whitelist: true,
            stopAtFirstError: true,
            transform: true,
        })) { comment }: CreateCommentDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        const result = await this.commentsService.changeComment(comment, comment_id, article_id, user_jwt_payload.id)
        return result
    }

    @UseFilters(ExcepMultiLangFilter)
    @Delete('/:comment_id')
    async deleteComment(
        @Param('article_id', ParseIntPipe) article_id: number,
        @Param('comment_id', ParseIntPipe) comment_id: number,
        @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user_jwt_payload = req.user as UserJWTInterfaces
        const result = await this.commentsService.deleteComment(comment_id, article_id, user_jwt_payload.id)
        return result
    }
}
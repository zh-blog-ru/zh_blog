import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Scope, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { Request } from 'express';
import { isPublic } from 'Generated/PublicDecorator';
import { ArticleInterfaces } from 'interfaces/ArticleInterfaces';
import { isAdmin } from 'Generated/AdminDecorator';
import { UpdateArticlesDto } from 'DTO/UpdateArticlesDto.dto';
import { CreateArticlesDto } from 'DTO/CreateArticlesDto.dto';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import { ExcepMultiLangFilter } from 'Generated/ExcepMultiLangFilter';

@Controller({
  path: 'articles',
  scope: Scope.DEFAULT
})
export class ArticleController {

  constructor(
    private readonly articleService: ArticleService, 
  ) { }


  @isAdmin()
  @Get('info')
  async getAllArticles() {
    const data = await this.articleService.getArticlesInfo()
    return data
  }

  @isPublic()
  @Get()
  async getArticles(@Query('locale') locale: string): Promise<Omit<ArticleInterfaces, 'content'>[] | undefined> {
    const data = await this.articleService.getArticles(locale)
    console.log(data)
    return data
  }

  @isPublic()
  @Get(':id')
  async getArticle(@Param('id', ParseIntPipe) id: number, @Query('locale') locale: string, @Req() req: Request): Promise<ArticleInterfaces | undefined> {
    const data = await this.articleService.getArticle(id, locale)
    return data
  }

  @isAdmin()
  @Get('info/:id')
  async getArticleInfo(@Param('id', ParseIntPipe) id: number, @Query('locale') locale: string): Promise<ArticleInterfaces | undefined> {
    const data = await this.articleService.getArticleInfo(id, locale)
    return data
  }

  @UseFilters(ExcepMultiLangFilter)
  @isAdmin()
  @Patch(':id')
  async ChangeArticles(@Param('id', ParseIntPipe) id: number, @Query('locale') locale: string,
    @Body(new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
      skipUndefinedProperties: true
    })) body: UpdateArticlesDto
  ) {
    await this.articleService.changeArticles(id, locale, body)
  }


  @isAdmin()
  @Post()
  async CreateArticles(@Body(new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
    transform: true,
  })) body: CreateArticlesDto
  ) {
    await this.articleService.createArticles(body)
  }
} 
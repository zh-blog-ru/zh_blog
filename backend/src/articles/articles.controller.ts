import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Scope, UseGuards } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { Request } from 'express';
import { isPublic } from 'Generated/PublicDecorator';
import { ArticleInterfaces } from 'interfaces/ArticleInterfaces';

@Controller({
  path: 'articles',
  scope: Scope.DEFAULT
})
export class ArticleController {

  constructor(
    private readonly articleService: ArticleService,
  ) { }


  @isPublic()
  @Get()
  async getArticles(): Promise<Omit<ArticleInterfaces, 'content'>[] | undefined> {
    const data = await this.articleService.getArticles()
    return data
  }

  @isPublic()
  @Get(':id')
  async getArticle(@Param('id', ParseIntPipe) id: number): Promise<ArticleInterfaces | undefined> {
    const data = await this.articleService.getArticle(id)
    return data
  }

} 
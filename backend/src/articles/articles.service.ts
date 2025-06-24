import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ArticleInterfaces } from 'interfaces/ArticleInterfaces';
import { I18nContext } from 'nestjs-i18n';
import { DatabaseService } from 'src/database/database.service';


type ArticleWithoutContent = Omit<ArticleInterfaces, 'content'>;

@Injectable()
export class ArticleService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    private readonly logger = new Logger(ArticleService.name);

    async getArticles(): Promise<ArticleWithoutContent[] | []> {
        const locale = I18nContext.current()?.lang as string 
        try {
            const articles: ArticleWithoutContent[] | [] = (await this.databaseService.query(`
            select a.id, a.img, a.theme, a.time_to_read, a.create_at, a.update_at, at.locale, at.title, at.resume from articles a
            join articles_translation at ON a.id=at.article_id where at.locale=$1 order by a.id desc
            `, [locale]
            )).rows
            return articles
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }
    async getArticle(id: number): Promise<ArticleInterfaces> {
        const locale = I18nContext.current()?.lang as string
        try {
            const article: [ArticleInterfaces] | [] = (await this.databaseService.query(`
            select a.*, at.locale, at.title, at.resume, at.content from articles a
            join articles_translation at ON a.id=at.article_id where at.locale=$1 and a.id=$2
            `, [locale, id]
            )).rows as [ArticleInterfaces] | []
            if (article.length == 0) {
                throw new NotFoundException()
            } else if (article.length > 1) {
                this.logger.error('Запрашивается одна статья с id: ', id, " , но на выходе больше одной и ошибка")
                throw new InternalServerErrorException()
            }
            return article[0]
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }
    async getArticlesLikedUser(user_id: number) {
        const locale = I18nContext.current()?.lang as string
        try {
            const articles = (await this.databaseService.query(`
                select a.img, at.title, a.id from likes l
                JOIN articles a ON a.id = l.article_id
                JOIN articles_translation at ON at.article_id = l.article_id
                where l.user_id=$1 and at.locale=$2 and l.is_like = true
                `, [user_id,locale])).rows as [] | Pick<ArticleInterfaces, 'img' | 'title'>[]
            return articles
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }
}

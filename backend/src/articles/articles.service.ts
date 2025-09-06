import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateArticlesDto } from 'DTO/CreateArticlesDto.dto';
import { UpdateArticlesDto } from 'DTO/UpdateArticlesDto.dto';
import { ArticleInterfaces } from 'interfaces/ArticleInterfaces';
import { I18nContext } from 'nestjs-i18n';
import { DatabaseService } from 'src/database/database.service';
import { locales } from 'src/i18n/generated/locales';


type ArticleWithoutContent = Omit<ArticleInterfaces, 'content'>;

@Injectable()
export class ArticleService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    private readonly logger = new Logger(ArticleService.name);

    async getArticles(locale: string): Promise<ArticleWithoutContent[] | []> {
        try {
            const shouldFilterByLocale = locales.includes(locale);
            let query = `
            SELECT 
                a.id, 
                a.img, 
                a.theme, 
                a.time_to_read, 
                a.create_at, 
                a.update_at, 
                at.locale, 
                at.title, 
                at.resume 
            FROM articles a
            JOIN articles_translation at ON a.id = at.article_id 
            WHERE at.is_active = true
        `;

            if (shouldFilterByLocale) {
                query += ` AND at.locale = $1`;
            }
            query += ` ORDER BY a.id DESC`;

            const articles: ArticleWithoutContent[] | [] = (await this.databaseService.query(
                query,
                shouldFilterByLocale ? [locale] : []
            )).rows;

            return articles;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
    async getArticle(id: number, locale: string): Promise<ArticleInterfaces> {
        try {
            const article: [ArticleInterfaces] | [] = (await this.databaseService.query(`
            select a.*, at.locale, at.title, at.resume, at.content from articles a
            join articles_translation at ON a.id=at.article_id where at.locale=$1 and a.id=$2 and at.is_active=true
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
    async getArticleInfo(id: number, locale: string) {
        try {
            const article = (await this.databaseService.query(`
            select a.*, at.locale, at.title, at.resume, at.content, at.is_active from articles a
            join articles_translation at ON a.id=at.article_id where at.locale=$1 and a.id=$2 
            `, [locale, id]
            )).rows as [ArticleInterfaces & { is_active: boolean }] | []
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
                where l.user_id=$1 and at.locale=$2 and l.is_like = true and at.is_active=true
                `, [user_id, locale])).rows as [] | Pick<ArticleInterfaces, 'img' | 'title'>[]
            return articles
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async getArticlesInfo() {
        try {
            const articles: (ArticleWithoutContent & { is_active: boolean })[] | [] = (await this.databaseService.query(`
            select a.id, a.img, a.theme, a.time_to_read, a.create_at, a.update_at, at.locale, at.title, at.resume, at.is_active from articles a
            join articles_translation at ON a.id=at.article_id order by a.id desc
            `)).rows
            return articles
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async changeArticles(id: number, locale: string, body: UpdateArticlesDto) {
        // Начинаем транзакцию
        const client = await this.databaseService.connect(); // Получаем клиент для транзакции

        try {
            await client.query('BEGIN'); // Начало транзакции

            // Обновляем основную таблицу articles (только те поля, которые есть в body)
            const articlesFields = ['img', 'theme', 'time_to_read'];
            const articlesFieldsToUpdate = Object.keys(body).filter(key => articlesFields.includes(key));

            if (articlesFieldsToUpdate.length > 0) {
                const articlesSetClause = articlesFieldsToUpdate
                    .map((key, index) => `${key} = $${index + 1}`)
                    .join(', ');

                await client.query(
                    `UPDATE articles SET ${articlesSetClause} WHERE id = $${articlesFieldsToUpdate.length + 1}`,
                    [...articlesFieldsToUpdate.map(key => body[key]), id]
                );
            }

            // Обновляем таблицу перевода articles_translation (только те поля, которые есть в body)
            const translationFields = ['title', 'resume', 'content', 'is_active'];
            const translationFieldsToUpdate = Object.keys(body).filter(key => translationFields.includes(key));

            if (translationFieldsToUpdate.length > 0) {
                const translationSetClause = translationFieldsToUpdate
                    .map((key, index) => `${key} = $${index + 1}`)
                    .join(', ');

                await client.query(
                    `UPDATE articles_translation 
                 SET ${translationSetClause} 
                 WHERE article_id = $${translationFieldsToUpdate.length + 1} AND locale = $${translationFieldsToUpdate.length + 2}`,
                    [...translationFieldsToUpdate.map(key => body[key]), id, locale]
                );
            }

            // Если все успешно - коммитим транзакцию
            await client.query('COMMIT');
        } catch (error) {
            // В случае ошибки - откатываем транзакцию
            await client.query('ROLLBACK');
            this.logger.error(error);
            throw new InternalServerErrorException();
        } finally {
            client.release();
        }
    }

    async addImagesToArticles(article_id: number, filename: string) {
        try {
            await this.databaseService.query(
                `
                UPDATE zh_data.articles 
                SET images = images 
                WHERE id = $1;
            `, [article_id, filename]
            )
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async deleteImagesToArticles(article_id: number, filename: string) {
        try {
            await this.databaseService.query(
                `
            UPDATE articles 
            SET images = array_remove(images, $2::varchar) 
            WHERE id = $1;
        `, [article_id, filename]
            )
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }


    async createArticles(body: CreateArticlesDto) {
        try {
            const articles: ArticleWithoutContent[] = (await this.databaseService.query(`
            WITH inserted_article AS (
                INSERT INTO articles (img, theme, time_to_read)
                VALUES ($1, $2, $3)
                RETURNING id
            )
            INSERT INTO articles_translation (article_id, locale, title, resume, content)
            SELECT id, locale, '', '', ''
            FROM inserted_article
            CROSS JOIN (VALUES ('ru'), ('en')) AS locales(locale)
            RETURNING article_id
        `, [body.img, body.theme, body.time_to_read])).rows;

            return articles;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}

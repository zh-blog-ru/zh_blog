import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CommentsInterfaces } from 'interfaces/CommentsInterface';
import { I18nService, I18nTranslation } from 'nestjs-i18n';
import { DatabaseService } from 'src/database/database.service';
import * as createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

@Injectable()
export class CommentsService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }
    private readonly logger = new Logger(CommentsService.name);

    async getCommentsByArticleId(article_id: number, page: number, currentUserId: number | undefined) {
        const limit = 10
        const offset = (page - 1) * limit
        try {
            const res = (await this.databaseService.query(`
            select c.id, c.create_at, c.user_id,  c.data, c.update_at, c.parent_comment_id, u.username, u.profile_picture_url,
            (c.user_id = $4) AS "isOwner"
            from comments c JOIN users u ON c.user_id = u.id
            where article_id=$1 order by c.id desc limit $2 offset $3
            `, [article_id, limit, offset, currentUserId]))
            const comments = res.rows as CommentsInterfaces[] | []
            return { comments, count: res.rowCount ?? 0 }
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async setComment(user_id: number, article_id: number, data: string) {
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        const sanitizedComment = DOMPurify.sanitize(data);
        try {
            const comment = (await this.databaseService.query(`
            WITH InsertedComment AS (
                insert into comments(user_id,article_id,data)
                values ($1,$2,$3)
                RETURNING id, user_id, create_at, data, update_at, parent_comment_id
            )
            select ic.id, ic.create_at, ic.user_id, ic.data, ic.update_at, ic.parent_comment_id, u.username, u.profile_picture_url,
            (u.id = $1) AS "isOwner"
                from InsertedComment ic JOIN users u ON ic.user_id = u.id
            `, [user_id, article_id, sanitizedComment])).rows[0] as CommentsInterfaces
            return comment
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async changeComment(comment: string, comment_id: number, article_id: number, user_id: number): Promise<Pick<CommentsInterfaces, 'update_at' | 'data'>> {
        try {
            const res = (await this.databaseService.query(`
            update comments set data=$1
                where id = $2 and user_id = $3 and article_id = $4 RETURNING update_at, data
            `, [comment, comment_id, user_id, article_id]))
            if (res.rowCount === 0) {
                throw new BadRequestException(
                    'Комментарий не найден или у вас нет прав для его изменения',
                );
            }
            return res.rows[0]
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async deleteComment(comment_id: number, article_id: number, user_id: number): Promise<void> {
        try {
            await this.databaseService.query(`
            delete from comments where id = $1 and user_id = $2 and article_id = $3
            `, [comment_id, user_id, article_id])
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }
}

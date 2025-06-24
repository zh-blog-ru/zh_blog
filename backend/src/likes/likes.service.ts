import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { LikesInterfaces } from 'interfaces/LikesInterfaces';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LikesService {

    constructor(
        private readonly databaseService: DatabaseService,
    ) { }
    private readonly logger = new Logger(LikesService.name);

    async getLikes(article_id: number, user_id?: number) {
        try {
            const likes = (await this.databaseService.query(`
            SELECT
                is_like,
                COALESCE(COUNT(*), 0) AS count,
                COALESCE((SUM(CASE WHEN user_id = $1 THEN 1 ELSE 0 END) > 0), false) AS is_current_user
            FROM likes
            WHERE article_id = $2
            GROUP BY is_like

            UNION ALL

            SELECT
                true as is_like,
                0 as count,
                false as is_current_user
            WHERE NOT EXISTS (SELECT 1 FROM likes WHERE article_id = $2 AND is_like = true)

            UNION ALL

            SELECT
                false as is_like,
                0 as count,
                false as is_current_user
            WHERE NOT EXISTS (SELECT 1 FROM likes WHERE article_id = $2 AND is_like = false)

            ORDER BY is_like DESC;
        `, [(user_id != undefined ? user_id : null) as number, article_id])).rows as LikesInterfaces[] | [];
            return likes
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async setLike(article_id: number, user_id: number, isLike: boolean) {
        try {
            const likes = await this.databaseService.query(`
            insert into likes(user_id,article_id,is_like) VALUES ($1,$2,$3)
            ON CONFLICT (user_id, article_id)
            DO UPDATE SET is_like = $3;
            `, [user_id, article_id, isLike])
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async deleteLike(article_id: number, user_id: number) {
        try {
            const likes = await this.databaseService.query(`
            delete from likes where user_id=$1 and article_id=$2
            `, [user_id, article_id])
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

}  

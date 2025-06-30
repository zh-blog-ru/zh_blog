import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, IntrinsicException, Logger } from '@nestjs/common';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import { DatabaseService } from 'src/database/database.service';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrivateUserInterfaces, PublicUserInterfaces } from './Interfaces';
import { UserInterfaces } from 'interfaces/UserInterfaces';
import { HttpFormException } from 'Generated/HttpFormException';
import { FileService } from 'src/file/file.service';
import { join } from 'path';
const bcrypt = require('bcrypt');
import * as createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';


@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly i18n: I18nService<I18nTranslations>,
        private readonly fileService: FileService,
    ) { }

    async findJWTPayloadByUsername(username: string): Promise<UserJWTInterfaces & { password_hash: string } | false> {
        try {
            const user_jwt_payload: UserJWTInterfaces & { password_hash: string } | undefined = await (await this.databaseService.query(`
            select password_hash,id,username,role from users where username=$1`
                , [username])).rows[0]

            if (!user_jwt_payload) {
                return false;
            }
            return user_jwt_payload;
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async findUserById(id: string | number)
        : Promise<Omit<PrivateUserInterfaces, 'isOwner'>> {
        const locale = I18nContext.current()?.lang
        try {
            const user = (await this.databaseService.query(`
            select id, username, email, profile_picture_url, about_me from users where id=$1
            `, [id])).rows as [Omit<PrivateUserInterfaces, 'isOwner'>] | []
            if (user.length === 0) {
                throw new HttpException(this.i18n.t('validation.NOT_FOUND', { lang: locale }), HttpStatus.NOT_FOUND);
            } else if (user.length > 1) {
                this.logger.error('Запрашивается один пользователь с id: ', id, " , но на выходе больше одного и ошибка")
                throw new InternalServerErrorException()
            }
            return user[0];
        } catch (error) {
            this.logger.error(error)
            if (error instanceof IntrinsicException) {
                throw error
            }
            throw new InternalServerErrorException()
        }
    }
    async deleteAccount(id: number) {
        try {
            const { profile_picture_url } = (await this.databaseService.query(`
                DELETE from users where id = $1 RETURNING profile_picture_url`,
                [id])).rows[0]
            return profile_picture_url
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
    async changeProfile({ id, username, about_me }: Partial<Pick<UserInterfaces, 'username' | 'about_me' | 'id'>>) {
        try {
            const window = new JSDOM('').window;
            const DOMPurify = createDOMPurify(window);
            const sanitizedAboutMe = DOMPurify.sanitize(about_me || '');
            const jwt_payload = (await this.databaseService.query(`
                UPDATE users SET username=$1, about_me=$2 WHERE id = $3 RETURNING id, username, role`,
                [username, sanitizedAboutMe || null, id])).rows[0];
            return jwt_payload
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async ChangeEmail(id: number, new_email: string) {
        try {
            const locale = I18nContext.current()?.lang
            await this.databaseService.query(`
            update users set email=$1 where id=$2
            `, [new_email, id])
            return this.i18n.t('validation.EMAIL_BEEN_CHANGE', { lang: locale })
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async changeProfileImage(id: number, profile_picture_url: string | null) {
        try {
            const res = await (await this.databaseService.query(`
                WITH old_values AS (
                    SELECT id, profile_picture_url AS old_profile_picture_url 
                    FROM users
                    WHERE id = $2
                )
            update users u set profile_picture_url=$1 from old_values where u.id=$2 RETURNING old_values.old_profile_picture_url
            `, [profile_picture_url, id])).rows[0] as { old_profile_picture_url: string }
            return res.old_profile_picture_url
        } catch (error) {
            if (profile_picture_url) {
                const filePath = join(process.cwd(), 'uploads/stable/images', profile_picture_url)
                await this.fileService.deleteFile(filePath)
            }
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }

    async resetPassword(email: string, newPassword: string) {
        const locale = I18nContext.current()?.lang
        try {
            const salt = await bcrypt.genSalt(10);
            const new_password_hash = await bcrypt.hash(newPassword, salt);
            await this.databaseService.query(`
            update users set password_hash=$1 where email=$2
            `, [new_password_hash, email])
            return this.i18n.t('validation.PASSWORD_BEEN_CHANGE', { lang: locale })
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }

    }

    async changePassword(id: number, password: string, newPassword: string) {
        const locale = I18nContext.current()?.lang
        const user = (await this.databaseService.query(`
            select password_hash from users where id=$1
            `, [id])).rows[0] as { password_hash: string } | undefined
        if (!user) {
            throw BadRequestException
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
            const salt = await bcrypt.genSalt(10);
            const new_password_hash = await bcrypt.hash(newPassword, salt);
            await this.databaseService.query(`
            update users set password_hash=$1 where id=$2
            `, [new_password_hash, id])
            return this.i18n.t('validation.PASSWORD_BEEN_CHANGE', { lang: locale })
        } else {
            throw new HttpFormException({
                errors: [this.i18n.t('validation.INCORRECT_PASSWORD', { lang: locale })],
                property: 'password'
            }, HttpStatus.BAD_REQUEST)
        }
    }
}



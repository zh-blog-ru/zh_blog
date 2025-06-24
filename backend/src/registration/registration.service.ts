import { ValidationService } from './../validation/validation.service';
import { DatabaseService } from './../database/database.service';
import { Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import { CreateUserDto } from 'DTO/CreateUserDto.dto';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
const bcrypt = require('bcrypt');

@Injectable()
export class RegistrationService {

    private readonly logger = new Logger(RegistrationService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly validationService: ValidationService,

    ) { }

    async createUser(user: CreateUserDto): Promise<UserJWTInterfaces> {
        await this.validationService.UsernameIsExists(user.username, false)
        await this.validationService.EmailIsExists(user.email, false)

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(user.password, salt);
        try {
            const res = await this.databaseService.query(`
            insert into users(username,email,password_hash) values($1,$2,$3) RETURNING id,username,role
            `, [user.username, user.email, password_hash])
            const payload: UserJWTInterfaces = res.rows[0]
            return payload
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException()
        }
    }
}

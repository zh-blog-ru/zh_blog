import { Injectable, Query, Scope, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg'
interface DatabaseConfig {
    DATABASE_PORT: number,
    DATABASE_HOST: string,
    DATABASE_USER: string,
    DATABASE_PASSWORD: string,
    DATABASE_DB: string,
    DATABASE_MAX_POOL: number
}

@Injectable({
    scope: Scope.DEFAULT
})
export class DatabaseService {
    private readonly client = new Pool({
        user: this.configService.get('DATABASE_USER'),
        host: this.configService.get('DATABASE_HOST'),
        database: this.configService.get('DATABASE_DB'),
        password: this.configService.get('DATABASE_PASSWORD'),
        port: this.configService.get('DATABASE_PORT'),
        idleTimeoutMillis: 20000,
        max: this.configService.get('DATABASE_MAX_POOL'),
        application_name: 'zhblog.ru',
        connectionTimeoutMillis: 3000,
        statement_timeout: 3000, 

    }) 
    constructor(private readonly configService: ConfigService<DatabaseConfig>) {}

    async connect() {
        const client = await this.client.connect()
        return client
    }
    async query(query: string, params?: (number | string | boolean | undefined | null | string[])[]) {
        const data = await this.client.query(query,params)
        return data
    }
}

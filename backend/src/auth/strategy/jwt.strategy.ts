import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy<any, UserJWTInterfaces, UserJWTInterfaces>(Strategy, 'JWTStrategy') {
  constructor() {
    const configService = new ConfigService();
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => { 
          if (req.cookies && req.cookies['jwt']) {
            return req.cookies['jwt']
          }
          return null
        },
      ], ExtractJwt.fromAuthHeaderAsBearerToken(),),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_TOKEN_SECRET'),
    });
  }
  validate(payload: UserJWTInterfaces): UserJWTInterfaces {
    return payload;
  }
}
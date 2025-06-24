import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<UserJWTInterfaces | false> {
    const user = await this.usersService.findJWTPayloadByUsername(username);
    if (!user) {
      return false
    }
    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) {
      return false
    }
    const { password_hash, ...user_jwt_payload } = user;
    return user_jwt_payload;
  }

  async createJWT(payload: UserJWTInterfaces): Promise<string> {
    const jwt = this.jwtService.sign(payload)
    return jwt
  }
}

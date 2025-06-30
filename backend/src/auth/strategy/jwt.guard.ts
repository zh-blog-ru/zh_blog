import { UserJWTInterfaces } from 'interfaces/UserJWTInterfaces';
import { BadRequestException, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_ADMIN_KEY } from "Generated/AdminDecorator";
import { IS_PUBLIC_KEY } from "Generated/PublicDecorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('JWTStrategy') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user_jwt_payload, info, context: ExecutionContext, status?: any) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if(isAdmin) {
      if(user_jwt_payload?.role === 'admin') {
        return user_jwt_payload
      } else {
          throw new ForbiddenException()        
      }
    }
    if (user_jwt_payload === false) {
      if (isPublic) {
        return null 
      } else {
        super.handleRequest(err, user_jwt_payload, info, context, status)
      }
    } else {
      return user_jwt_payload
    }
  }
}
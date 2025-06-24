import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
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
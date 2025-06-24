import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('REQUEST: ', req.method)
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const cookieToken = req.cookies['XSRF-TOKEN'];
    const headerToken = req.headers['x-xsrf-token'];
    
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    next();
  }
} 
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  mixin,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface Decoded {
  role: string;
}

export const RoleGuard = (role: string[]) => {
  class RoleGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      if (!request.headers.authorization) return;
      try {
        const user = await this.validateToken(request.headers.authorization);
        request.user = user;
        return true;
      } catch (error) {
        throw error;
      }
    }
    async validateToken(auth: string) {
      if (auth.split(' ')[0] !== 'Bearer') {
        // beartoken
        throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
      }
      const token = auth.split(' ')[1];
      return jwt.verify(token, 'topsecret51', (error, decoded: Decoded) => {
        if (error) {
          const message = 'Token error: ' + (error.message || error.name);
          throw new HttpException(message, HttpStatus.FORBIDDEN);
        }
        if (!(role.includes(decoded.role) || decoded.role === 'ADMIN')) {
          const message2 = 'not authorized: ask for access';
          throw new HttpException(message2, HttpStatus.FORBIDDEN);
        }
        return decoded;
      });
    }
  }

  const guard = mixin(RoleGuardMixin);
  return guard;
};

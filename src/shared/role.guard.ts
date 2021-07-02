import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  mixin,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from 'src/auth/users.repository';

interface Decoded {
  role: string;
}

export const RoleGuard = (role: string[]) => {
  class RoleGuardMixin implements CanActivate {
    constructor(
      @InjectRepository(UserRepository)
      private userRepository: UserRepository,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      if (!request.headers.authorization) return;
      try {
        const user = await this.validateToken(token);
        const isValid = await this.userRepository.validateToken(token);
        request.user = user;
        return isValid;
      } catch (error) {
        throw error;
      }
    }
    async validateToken(token) {
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

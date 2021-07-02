import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  mixin,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { tokenDecoded } from 'src/auth/dto/auth-credential.dto';
import { UserRepository } from 'src/auth/users.repository';

export const AuthGuard = () => {
  class AuthGuardMixin implements CanActivate {
    constructor(
      @InjectRepository(UserRepository)
      private userRepository: UserRepository,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      console.log('asd');
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

    async validateToken(token: string) {
      return jwt.verify(
        token,
        process.env.SECRET_KEY,
        async (error, decoded: tokenDecoded) => {
          if (error) {
            const message = 'Token error: ' + (error.message || error.name);
            throw new HttpException(message, HttpStatus.FORBIDDEN);
          }
          return decoded;
        },
      );
    }
  }
  const guard = mixin(AuthGuardMixin);
  return guard;
};

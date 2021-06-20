import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy } from './jwt.strategy';
import { EmpresaRepository } from 'src/empresas/empresa.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topsecret51',
      signOptions: {
        expiresIn: 3600 * 24 * 30,
      },
    }),
    TypeOrmModule.forFeature([UserRepository, EmpresaRepository]),
  ],
  providers: [AuthService, jwtStrategy],
  controllers: [AuthController],
  exports: [jwtStrategy, PassportModule],
})
export class AuthModule {}

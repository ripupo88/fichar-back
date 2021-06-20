import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmpresaRepository } from './empresa.repository';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { UserRepository } from 'src/auth/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpresaRepository, UserRepository]),
    AuthModule,
  ],
  providers: [EmpresasService],
  controllers: [EmpresasController],
})
export class EmpresasModule {}

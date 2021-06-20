import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/users.repository';
import { EmpresaRepository } from 'src/empresas/empresa.repository';
import { RegistroRepository } from './registro.repository';
import { RegistrosController } from './registros.controller';
import { RegistrosService } from './registros.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegistroRepository,
      UserRepository,
      EmpresaRepository,
    ]),
    AuthModule,
  ],
  controllers: [RegistrosController],
  providers: [RegistrosService],
})
export class RegistrosModule {}

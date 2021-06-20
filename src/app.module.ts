import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EmpresasModule } from './empresas/empresas.module';
import { RegistrosModule } from './registros/registros.module';

@Module({
  imports: [TasksModule, AuthModule, DatabaseModule, EmpresasModule, RegistrosModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EmpresasModule } from './empresas/empresas.module';
import { RegistrosModule } from './registros/registros.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SocketGateway } from './gateway/socket.gateway';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    DatabaseModule,
    EmpresasModule,
    RegistrosModule,
    NotificationsModule,
  ],
  providers: [SocketGateway],
})
export class AppModule {}

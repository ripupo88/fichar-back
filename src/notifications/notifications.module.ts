import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../service.json';

@Module({
  providers: [NotificationsService],
  imports: [
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert({
          privateKey: serviceAccount.private_key,
          clientEmail: serviceAccount.client_email,
          projectId: serviceAccount.project_id,
        }),
      }),
    }),
  ],
})
export class NotificationsModule {}

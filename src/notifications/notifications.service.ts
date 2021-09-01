import { Injectable } from '@nestjs/common';
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';

type NotifObject = {
  token: string;
  title: string;
  body: string;
};
@Injectable()
export class NotificationsService {
  constructor(private messagingService: FirebaseMessagingService) {}

  entrada(userId: string, notifToken: string) {
    const notifObject: NotifObject = {
      token: notifToken,
      title: `${userId || 'Sin nombre'} fichó la entrada`,
      body: `${userId || 'Sin nombre'} acaba de fichar su entrada por QR`,
    };
    this.notificate(notifObject);
  }
  salida(userId: string, notifToken: string) {
    const notifObject: NotifObject = {
      token: notifToken,
      title: `${userId || 'Sin nombre'} fichó la salida`,
      body: `${userId || 'Sin nombre'} acaba de fichar su salida por QR`,
    };
    this.notificate(notifObject);
  }

  private notificate(data: NotifObject) {
    const { token, body, title } = data;
    return this.messagingService.messaging.send({
      token,
      android: {
        notification: {
          visibility: 'public',
          defaultSound: true,
          sound: 'default',
          title,
          body,
        },
      },
    });
  }

  getUsers() {
    return this.messagingService.messaging.send({
      token:
        'fcjraeHkTzq-S7MBEPYNzT:APA91bF6R2pXFKXXoan6VoSzNQufXQtJ7snfmYqDe-S76i5VxBWeVPLTynuY36-aDlNIrFv54IqYaZTMZHqbUgFRghtOtRwlSm-o8c2gSVZqMhmDd9O16pmNdCaV03jD9SYZ841oGb-Y',
      notification: {
        title: 'A ver a ver',
        body: 'vamos al gym',
      },
    });
  }
}

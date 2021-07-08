import { Injectable } from '@nestjs/common';
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';

@Injectable()
export class NotificationsService {
  constructor(private messagingService: FirebaseMessagingService) {}

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

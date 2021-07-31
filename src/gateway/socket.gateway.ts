import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService, Notif } from 'src/auth/auth.service';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { EmpresasService } from 'src/empresas/empresas.service';

@WebSocketGateway(3003, { cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private empresaServise: EmpresasService,
    private authService: AuthService,
  ) {}

  clients: string[] = [];

  @WebSocketServer() socket: Server;

  handleDisconnect(client: Socket) {
    console.log(this.clients.length);
    this.clients = this.clients.filter((item) => client.id !== item);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.clients = [...this.clients, client.id];
    console.log(this.clients.length);
  }

  @SubscribeMessage('empresa')
  async handleMessage(client: Socket, payload: any) {
    console.log('ll ws', payload);
    const resp = await this.empresaServise.getAllEmpresas(payload.user);
    if (payload !== 65) {
      client.emit('empresa', resp);
    }
  }

  @SubscribeMessage('user')
  async handleUser(client: Socket, payload: Notif & { userId: string }) {
    const { userId } = payload;
    delete payload.userId;
    await this.authService.setNotifUser(userId, payload);

    // const resp = await this.empresaServise.getAllEmpresas(payload.user);
    // if (payload !== 65) {
    //   client.emit('empresa', resp);
    // }
  }
}

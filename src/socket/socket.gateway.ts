import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService, Notif } from 'src/auth/auth.service';
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
  async handleUser(
    client: Socket,
    payload: Notif & { userId: string; admin: string },
  ) {
    const { userId, admin } = payload;
    delete payload.userId;
    delete payload.admin;
    console.log(payload);
    await this.authService.setNotifUser(admin, userId, payload);

    // const resp = await this.empresaServise.getAllEmpresas(payload.user);
    // if (payload !== 65) {
    //   client.emit('empresa', resp);
    // }
  }
}

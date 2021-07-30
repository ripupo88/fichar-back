import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3003, { cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    console.log(this.clients);
    this.socket.to(this.clients[0]).emit('message', { resp: 'mar' });
  }
}

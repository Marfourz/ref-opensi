import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { IConnectedSocketUsers, IWSEmitArgs } from './ws-notification.types';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
  path: '/api/ws',
})
export class WsNotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  connectedUsers: IConnectedSocketUsers[] = [];

  handleConnection(client: Socket) {
    console.log('user-connected');
    const userInfo = this.connectedUsers.find(
      (cu: IConnectedSocketUsers) => cu.socket.id === client.id,
    );
    if (!userInfo) this.connectedUsers.push({ socket: client, userId: -1 });
  }

  handleDisconnect(client: Socket) {
    console.log('user-disconnected');
    this.connectedUsers = this.connectedUsers.filter(
      (cu: IConnectedSocketUsers) => cu.socket.id === client.id,
    );
  }

  notifyRoom(room: string, data: IWSEmitArgs<any>) {
    this.server.to(room).emit(data.event, data.value);
  }

  @SubscribeMessage('join-room')
  handleEnterRomm(
    @MessageBody('orgId') orgId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Client emit "join room" ', orgId);
    client.join(orgId);
    //this.server.to(userId).emit('room-joined', { success: true });
    //client.emit('room-joined', { success: true });
  }

  /*@SubscribeMessage('message')
  handleMessage(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ): number {
    console.log('Emit client "message"');
    return id;
    //client.emit('events', { name: 'Nest' });
  }*/

  @SubscribeMessage('connect_error')
  handleError() {
    console.log('ERROR ON CONNECTION');
  }
}

import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { IConnectedSocketUsers } from './ws-notification.types';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
  path: '/api/ws',
})
export class WsNotificationGateway {
  @WebSocketServer()
  server: Server;

  connectedUsers: IConnectedSocketUsers[] = [];

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ): number {
    return id;
    //client.emit('events', { name: 'Nest' });
  }
}

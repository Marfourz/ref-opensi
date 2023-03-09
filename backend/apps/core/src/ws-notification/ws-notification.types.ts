import { Socket } from 'socket.io';

export interface IConnectedSocketUsers {
  socket: Socket;
  userId?: number;
}

export interface IWSEmitArgs<T> {
  event: string;
  value: T;
}

import { Socket } from 'socket.io';

export interface IConnectedSocketUsers {
  socket: Socket;
  userId?: number;
}

export interface IWSEmitArgs<T> {
  event: Events;
  value: T;
}

enum Events {
  NEW_ORDER_RECORDED = 'NEW_ORDER_RECORDED',
  ORDER_UPDATED = 'ORDER_UPDATED',
}

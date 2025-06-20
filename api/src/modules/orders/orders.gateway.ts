import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Order } from '@prisma/client';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/orders' })
export class OrdersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(OrdersGateway.name);

  server: Server;

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('OrdersGateway inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('newOrder')
  handleNewOrder(
    @MessageBody() orderData: Order,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug(orderData, 'Novo pedido recebido');

    client.emit('orderReceived', { status: 'ok', orderId: orderData.id });
  }

  emitOrderCreated(order: Order) {
    this.server.emit('orderCreated', order);
  }

  emitOrderUpdated(order: Order) {
    this.server.emit('orderUpdated', order);
  }

  emitOrderDeleted(orderId: string) {
    this.server.emit('orderDeleted', { id: orderId });
  }
}

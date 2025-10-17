// websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/broker-connections',
})
export class WebSocketGatewayHandler
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('WebSocketGateway');
  private readonly brokerConnections = new Map<string, Socket>();

  handleConnection(socket: Socket) {
    const brokerId = socket.handshake.query.brokerId as string;
    if (brokerId) {
      this.brokerConnections.set(brokerId, socket);
      this.logger.log(`Broker connected: ${brokerId}`);
    }
  }

  handleDisconnect(socket: Socket) {
    const brokerId = Array.from(this.brokerConnections.entries()).find(
      ([, s]) => s === socket,
    )?.[0];
    if (brokerId) {
      this.brokerConnections.delete(brokerId);
      this.logger.log(`Broker disconnected: ${brokerId}`);
    }
  }

  sendNotificationToBroker(brokerId: string, message: any) {
    const socket = this.brokerConnections.get(brokerId);
    if (socket) {
      this.logger.log(`broker-notification : ${JSON.stringify(message)}`);

      socket.emit('broker-notification', message);
      return true;
    }
    return false;
  }

  broadcastToAreaBrokers(area: string, message: any) {
    this.logger.log(`broadcastToAreaBrokers : ${area} - ${message}`);
    this.server.emit(`area-${area}-notification`, message);
  }

  // @Cron('*/30 * * * * *') // Every 30 seconds
  // private notifyPendingRequests(brokerId: string) {
  //   console.log(`Checking for pending requests for broker ${brokerId}`);

  //   // Implement logic to check for pending requests for this broker
  //   // and resend notifications if needed
  // }
}

import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WebSocketGatewayHandler implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    private readonly brokerConnections;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    sendNotificationToBroker(brokerId: string, message: any): boolean;
    broadcastToAreaBrokers(area: string, message: any): void;
}

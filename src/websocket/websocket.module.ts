import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebSocketGatewayHandler } from './websocket.gateway';

@Module({
  providers: [WebSocketGatewayHandler, WebsocketService],
  exports: [WebSocketGatewayHandler],
})
export class WebsocketModule {}

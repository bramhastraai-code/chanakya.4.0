"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketGatewayHandler = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let WebSocketGatewayHandler = class WebSocketGatewayHandler {
    constructor() {
        this.logger = new common_1.Logger('WebSocketGateway');
        this.brokerConnections = new Map();
    }
    handleConnection(socket) {
        const brokerId = socket.handshake.query.brokerId;
        if (brokerId) {
            this.brokerConnections.set(brokerId, socket);
            this.logger.log(`Broker connected: ${brokerId}`);
        }
    }
    handleDisconnect(socket) {
        const brokerId = Array.from(this.brokerConnections.entries()).find(([, s]) => s === socket)?.[0];
        if (brokerId) {
            this.brokerConnections.delete(brokerId);
            this.logger.log(`Broker disconnected: ${brokerId}`);
        }
    }
    sendNotificationToBroker(brokerId, message) {
        const socket = this.brokerConnections.get(brokerId);
        if (socket) {
            this.logger.log(`broker-notification : ${JSON.stringify(message)}`);
            socket.emit('broker-notification', message);
            return true;
        }
        return false;
    }
    broadcastToAreaBrokers(area, message) {
        this.logger.log(`broadcastToAreaBrokers : ${area} - ${message}`);
        this.server.emit(`area-${area}-notification`, message);
    }
};
exports.WebSocketGatewayHandler = WebSocketGatewayHandler;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketGatewayHandler.prototype, "server", void 0);
exports.WebSocketGatewayHandler = WebSocketGatewayHandler = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        path: '/broker-connections',
    })
], WebSocketGatewayHandler);
//# sourceMappingURL=websocket.gateway.js.map
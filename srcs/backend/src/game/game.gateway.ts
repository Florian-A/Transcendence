import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GamesService } from './game.service';
import { FortyTwoAuthGuard } from 'src/auth/forty-two-auth.guard';
import { WsJwtGuard } from 'src/auth/ws-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

// @UseGuards(WsJwtGuard)
@WebSocketGateway({ cors: true, namespace: 'game' })
// @UseGuards(FortyTwoAuthGuard)
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gamesService: GamesService, private jwtService: JwtService) { }

  private logger: Logger = new Logger('Game Gateway');

  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Player Disconnected: ${client.id} from ${client.rooms}`);
    this.gamesService.disconnect(client);
  }

  // @UseGuards(WsJwtGuard)
  handleConnection(client: Socket, ...args: any[]) {
    client.emit('id', client.id)
    // return;
    const token = client.handshake.auth.Authorization?.split(' ')[1];
    console.log('token', token, client.handshake.auth)
    if (!token || !this.jwtService.verify(token, { secret: jwtConstants.secret })) {
      if (token) {
        client.emit('error', 'Invalid token');
        console.log('Invalid token')
      } else {
        client.emit('error', 'No token');
        console.log('No token')
      }
      client.disconnect();
      return;
    } else {
      console.log('client connected', client.id, client.handshake.headers)
      client.emit('id', client.id)
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('match')
  async handleMatch(client: Socket, payload: string): Promise<void> {
    this.gamesService.addToQueue(client, this.wss);
  }

  // @UseGuards(FortyTwoAuthGuard)
  @SubscribeMessage('leave')
  async handleLeave(client: Socket, payload: string): Promise<void> {
    this.gamesService.disconnect(client);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('keyPresses')
  async handleKeyPresses(client: Socket, payload: { up: boolean, down: boolean, time: number }): Promise<void> {
    this.gamesService.handleKeysPresses(client.id, payload);
  }
  // @UseGuards(WsJwtGuard)
  // @SubscribeMessage('UpKeyPressed')
  // async handleUpKeyPressed(client: Socket, payload: string): Promise<void> {
  //   console.log('UpKeyPressed', payload)
  //   this.gamesService.keyPressed(client.id, 1);
  //   // this.rooms[this.clients[client.id]].handleKey(client.id, 1)
  // }
  // @UseGuards(WsJwtGuard)
  // @SubscribeMessage('UpKeyReleased')
  // async handleUpKeyReleased(client: Socket, payload: string): Promise<void> {
  //   this.gamesService.keyPressed(client.id, 0);
  //   // this.rooms[this.clients[client.id]].handleKey(client.id, 0)
  //   console.log('UpKeyReleased', payload)
  // }
  // @UseGuards(WsJwtGuard)
  // @SubscribeMessage('DownKeyPressed')
  // async handleDownKeyPressed(client: Socket, payload: string): Promise<void> {
  //   this.gamesService.keyPressed(client.id, -1);
  //   console.log('DownKeyPressed', payload)
  //   // this.rooms[this.clients[client.id]].handleKey(client.id, -1)
  // }
  // @UseGuards(WsJwtGuard)
  // @SubscribeMessage('DownKeyReleased')
  // async handleDownKeyReleased(client: Socket, payload: string): Promise<void> {
  //   console.log('DownKeyReleased', payload)
  //   this.gamesService.keyPressed(client.id, 0);
  //   // this.rooms[this.clients[client.id]].handleKey(client.id, 0)
  // }

}


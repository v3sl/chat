import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { WebsocketExceptionsFilter } from 'src/filters/websocketExceptions.filter';
import { WsAccessTokenGuard } from 'src/user.auth/guards/ws/WsAccessToken.guard';
import { Token } from 'src/user.auth/types/types';
import { CreateMessageDto } from './dto/create.message.dto';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(WebsocketExceptionsFilter)
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesService: MessagesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  afterInit(server: any) {
    Logger.log('init');
  }
  async handleConnection(client: Socket) {
    const token = client.handshake.auth.authorization?.split(' ')[1];
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      client.send({
        event: 'error',
        data: {
          message: 'Access Denied',
        },
      });
      client.disconnect();
      return;
    }

    Logger.log('connected');
    client.emit('accessGranted');
  }
  handleDisconnect(client: Socket) {
    Logger.log('disconnected');
  }

  @WebSocketServer() server: Server;

  private users: Pick<User, 'id' | 'name'>[] = [];

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('createMessage')
  async create(client: Socket, createMessageDto: CreateMessageDto) {
    const token = client.handshake.auth.authorization.split(' ')[1];
    const { id } = this.jwtService.decode<Token>(token);
    const message = await this.messagesService.create(
      createMessageDto.text,
      id,
    );
    this.server.emit('recMessage', message);
    return message;
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('findAllMessages')
  async findAll() {
    return await this.messagesService.findAll();
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('join')
  joinChat(client: Socket) {
    const token = client.handshake.auth.authorization.split(' ')[1];
    const { id, username } = this.jwtService.decode<Token>(token);
    const toSend = {
      id,
      name: username,
    };
    this.server.emit('userJoin', toSend);
    if (!this.users.some((obj) => obj.id === toSend.id))
      this.users.push(toSend);
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('exit')
  exitChat(client: Socket) {
    Logger.log('exit');
    const token = client.handshake.auth.authorization.split(' ')[1];
    const { id, username } = this.jwtService.decode<Token>(token);
    const toSend = {
      id,
      name: username,
    };
    this.server.emit('userExit', toSend);
    this.users = this.users.filter((user) => user.id !== toSend.id);
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('getJoinedUsers')
  getJoinedUsers() {
    return this.users;
  }

  @SubscribeMessage('typing')
  async typing() {
    //todo
  }
}

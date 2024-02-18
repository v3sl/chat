import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthModuleOptions } from '@nestjs/passport';
import { AuthService } from 'src/user.auth/user.auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Module({
  imports: [AuthModuleOptions],
  providers: [
    MessagesGateway,
    MessagesService,
    PrismaService,
    JwtService,
    ConfigService,
    AuthService,
    UsersService,
  ],
  exports: [MessagesGateway, MessagesService, PrismaService],
})
export class MessagesModule {}

import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { UserAuthModule } from './user.auth/user.auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MessagesModule, UserAuthModule, UsersModule],
})
export class AppModule {}

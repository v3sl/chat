import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(text: string, userId: number) {
    return await this.prisma.message.create({
      data: {
        text,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    const messages = await this.prisma.message.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return messages;
  }
}

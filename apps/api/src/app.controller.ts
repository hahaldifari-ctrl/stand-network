import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getRoot() {
    return {
      service: 'stand-api',
      status: 'ok',
      version: '0.1.0',
    };
  }

  @Get('health')
  async getHealth() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      service: 'stand-api',
      status: 'ok',
      database: 'connected',
    };
  }
}

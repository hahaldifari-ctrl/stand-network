import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      service: 'stand-api',
      status: 'ok',
      version: '0.1.0',
    };
  }

  @Get('health')
  getHealth() {
    return {
      service: 'stand-api',
      status: 'ok',
    };
  }
}
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from '../auth/roles.guard';
import { NeedsController } from './needs.controller';
import { NeedsService } from './needs.service';

@Module({
  imports: [PrismaModule],
  controllers: [NeedsController],
  providers: [NeedsService, RolesGuard],
})
export class NeedsModule {}
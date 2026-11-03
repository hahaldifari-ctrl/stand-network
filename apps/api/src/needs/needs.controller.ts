import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '@prisma/client';
import { NeedsService } from './needs.service';
import { CreateNeedDto } from './dto/create-need.dto';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseStatusDto } from './dto/update-response-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('needs')
export class NeedsController {
  constructor(private readonly needsService: NeedsService) {}

  @Get()
  findAll() {
    return this.needsService.findAll();
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VERIFIER)
  findPending() {
    return this.needsService.findPending();
  }

  @Get('responses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VERIFIER)
  findResponses() {
    return this.needsService.findResponses();
  }

  @Patch('responses/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VERIFIER)
  updateResponseStatus(
    @Param('id') id: string,
    @Body() dto: UpdateResponseStatusDto,
  ) {
    return this.needsService.updateResponseStatus(id, dto.status);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.needsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateNeedDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.needsService.create(dto, req.user.id);
  }

  @Post(':id/pray')
  @UseGuards(JwtAuthGuard)
  pray(
    @Param('id') id: string,
    @Body() dto: CreatePrayerDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.needsService.pray(id, dto, req.user.id);
  }

  @Post(':id/respond')
  @UseGuards(JwtAuthGuard)
  respond(
    @Param('id') id: string,
    @Body() dto: CreateResponseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.needsService.respond(id, dto, req.user.id);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VERIFIER)
  verify(@Param('id') id: string) {
    return this.needsService.verify(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VERIFIER)
  approve(@Param('id') id: string) {
    return this.needsService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VERIFIER)
  reject(@Param('id') id: string) {
    return this.needsService.reject(id);
  }
}


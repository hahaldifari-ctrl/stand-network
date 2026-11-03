import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrganizationDto } from './create-organization.dto';
import { OrganizationsService } from './organizations.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateOrganizationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.create(dto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }
}
